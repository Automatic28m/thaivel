import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(
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
                LEFT JOIN geographies g ON p.geography_id = g.id`
        );

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error('🔥 Fetch Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}