import pool from '@/lib/db';
import { NextResponse } from 'next/server';

function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(text) {
    return normalizeText(text)
        .split(' ')
        .filter((token) => token.length >= 2);
}

function getKeywordScore(queryTokens, attraction) {
    const weightedText = [
        (attraction.name || '') + ' ' + (attraction.name || ''),
        attraction.category || '',
        attraction.province || '',
        attraction.district || '',
        attraction.sub_district || '',
        attraction.geography || '',
        attraction.description || ''
    ].join(' ');

    const targetTokens = new Set(tokenize(weightedText));
    if (targetTokens.size === 0 || queryTokens.length === 0) {
        return 0;
    }

    let matches = 0;
    for (const token of queryTokens) {
        if (targetTokens.has(token)) {
            matches += 1;
        }
    }

    return matches / queryTokens.length;
}

export async function POST(req) {
    try {
        const { message } = await req.json();
        const queryTokens = tokenize(message);

        // 3. Fetch all embedded attractions from Thaivel MySQL Database
        const [rows] = await pool.query(
            `SELECT 
                a.*, 
                s.name_en AS sub_district, 
                s.id AS sub_district_id,
                d.name_en AS district, 
                d.id AS district_id,
                p.name_en AS province,
                p.id AS province_id,
                g.name_eng AS geography,
                a.google_maps_url AS gmapsUrl,
                a.open_hour,
                a.tel,
                a.igUrl,
                a.facebookUrl,
                a.tiktokUrl,
                c.name AS category
            FROM attractions a
                LEFT JOIN category c ON a.category_id = c.id
                LEFT JOIN sub_districts s ON a.sub_district_id = s.id
                LEFT JOIN districts d ON s.district_id = d.id
                LEFT JOIN provinces p ON d.province_id = p.id
                LEFT JOIN geographies g ON p.geography_id = g.id
            ;`
        );

        // Use lightweight keyword scoring to keep serverless bundle size small.
        const scoredAttractions = rows.map(item => {
            const score = getKeywordScore(queryTokens, item);
            return { ...item, score };
        });

        // Sort by highest score first and take the top 2 closest matches
        scoredAttractions.sort((a, b) => b.score - a.score);
        const SIMILARITY_THRESHOLD = 0.25;
        const validMatches = scoredAttractions.filter(item => item.score > SIMILARITY_THRESHOLD);
        console.log("ValidMatches :", validMatches);
        

        if (validMatches.length === 0) {
            return NextResponse.json({
                reply: "Sawasdee! I am your Thaivels AI Guide. Tell me what kind of attraction, province, or vibe you are looking for, and I will search our database for the perfect match!",
                sources: []
            });
        }

        const topMatches = validMatches.slice(0, 3);

        // 5. Construct the strictly controlled RAG Prompt (NOW INCLUDES THE LOCALHOST LINK)
        const contextData = topMatches.length > 0
            ? topMatches.map(match =>
                `[Attraction: ${match.name}]
                Category: ${match.category || 'Uncategorized'}
                Location: ${match.sub_district || 'Unknown'}, ${match.district || 'Unknown'}, ${match.province || 'Unknown'} (${match.geography || 'Unknown'} Region)
                Operating Hours: ${match.open_hour || 'Not specified'}
                Contact/Phone: ${match.tel || 'Not specified'}
                Links: Google Maps (${match.gmapsUrl || 'N/A'}), Facebook (${match.facebookUrl || 'N/A'}), Instagram (${match.igUrl || 'N/A'}), TikTok (${match.tiktokUrl || 'N/A'})
                Thaivel Page Link: /attractionPage/${match.id}
                Description: ${match.description || 'No description available.'}`
            ).join('\n\n---\n\n')
            : "NO MATCHING DATA FOUND. The user's input is either gibberish, just a greeting, or unrelated to finding an attraction.";

        // Added instruction for the AI to provide the link in its response
        const systemPrompt = `You are a friendly and professional Thai tour guide assistant for the 'Thaivels' platform. 
        You are STRICTLY FORBIDDEN from using your pre-trained internet knowledge. You MUST ONLY recommend attractions explicitly provided in the ATTRACTION DATA block below. Do not invent, guess, or mention any other places in Thailand.
        
        Whenever you include the 'Thaivels Page Link', you MUST format it as a Markdown link so it is clickable, exactly like this: [Name of Attraction](/attractionPage/ID).
        
        ATTRACTION DATA:
        ${contextData}
        
        USER QUESTION: 
        ${message}`;

        // const systemPrompt = `Describe all of these attrcations; ${contextData}`;


        // 6. Call the Local LLM (Ollama running Llama 3)
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}` // Use your env variable
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Recommended high-performance free model
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.2, // Keeps the AI focused on your database facts
                stream: false
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            throw new Error(`Groq API Error: ${errorData.error?.message || groqResponse.statusText}`);
        }

        const groqData = await groqResponse.json();

        // 7. Return the AI's answer and upgraded sources to your Next.js Frontend
        return NextResponse.json({
            validMatches: validMatches,
            reply: groqData.choices[0].message.content,
            sources: topMatches.map(m => ({
                name: m.name,
                url: `/attractionPage/${m.id}`,
                image: m.image_url || m.pic1 || null,
            }))
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
    }
}