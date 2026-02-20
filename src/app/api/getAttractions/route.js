import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(
            `SELECT 
                    a.*, 
                    s.name_en AS sub_district, 
                    am.name_en AS district, 
                    p.name_en AS province, 
                    g.name_eng AS geography
                    FROM attractions a
                    LEFT JOIN sub_districts s ON a.sub_district_id = s.id
                    LEFT JOIN amphures am ON s.amphure_id = am.id
                    LEFT JOIN provinces p ON am.province_id = p.id
                    LEFT JOIN geographies g ON p.geography_id = g.id;`
        );

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error('🔥 Fetch Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}