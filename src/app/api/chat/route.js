import pool from '@/lib/db';
import { pipeline } from '@xenova/transformers';
import { NextResponse } from 'next/server';

// 1. The Math Function
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Global variable to cache the pipeline so it doesn't reload on every single chat message
let extractorInstance = null;

export async function POST(req) {
    try {
        const { message } = await req.json();

        // 2. Embed the User's Question 
        if (!extractorInstance) {
            extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }

        const output = await extractorInstance(message, { pooling: 'mean', normalize: true });
        const questionVector = Array.from(output.data);

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
            WHERE embedding IS NOT NULL;`
        );

        // 4. Run the Search (Calculate similarities)
        const scoredAttractions = rows.map(item => {
            const dbVector = typeof item.embedding === 'string' ? JSON.parse(item.embedding) : item.embedding;
            const score = cosineSimilarity(questionVector, dbVector);
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