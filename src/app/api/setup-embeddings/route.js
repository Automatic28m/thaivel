import pool from '@/lib/db';
import { pipeline } from '@xenova/transformers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Fetch attractions that don't have an embedding yet
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
                WHERE embedding IS NULL`
        );

        if (rows.length === 0) {
            return NextResponse.json({ message: "All attractions are already embedded!" });
        }

        // 2. Load the open-source embedding model into your Mac's memory
        // This downloads the model the first time you run it (around ~80MB)
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        let processedCount = 0;

        // 3. Loop through each attraction
        for (const item of rows) {
            // Combine the data into a rich text string
            const textToEmbed = `Name: ${item.name}. 
            Category: ${item.category || 'Uncategorized'}. 
            Location: ${item.sub_district || 'Unknown'}, ${item.district || 'Unknown'}, ${item.province || 'Unknown'} (${item.geography || 'Unknown'} Region). 
            Open Hours: ${item.open_hour || 'Not specified'}. 
            Phone: ${item.tel || 'Not specified'}. 
            Links: Maps: ${item.gmapsUrl || 'N/A'}, FB: ${item.facebookUrl || 'N/A'}, IG: ${item.igUrl || 'N/A'}, TikTok: ${item.tiktokUrl || 'N/A'}. 
            Description: ${item.description || 'No description available.'}`.replace(/\s+/g, ' ').trim();
            
            // 4. Generate the vector using the local open-source model
            // pooling: 'mean' and normalize: true are required for Cosine Similarity math later
            const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });

            // Convert the Float32Array into a standard JavaScript array
            const vectorArray = Array.from(output.data);

            // 5. Save the vector array back to MySQL as a JSON string
            await pool.query(
                'UPDATE attractions SET embedding = ? WHERE id = ?',
                [JSON.stringify(vectorArray), item.id]
            );

            processedCount++;
            console.log(`✅ Locally Embedded: ${item.name}`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully embedded ${processedCount} attractions using open-source model.`
        });

    } catch (error) {
        console.error("Embedding Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}