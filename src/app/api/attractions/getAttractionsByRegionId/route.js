import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const connection = await pool.getConnection();

    try {
        const { searchParams } = new URL(request.url);
        const regionId = searchParams.get('id');

        if (!regionId) {
            return NextResponse.json({ error: "Region ID is required" }, { status: 400 });
        }

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
            LEFT JOIN geographies g ON p.geography_id = g.id
            WHERE g.id = ?;`,
            [regionId]
        );

        if (result.length === 0) {
            return NextResponse.json({ success: true, data: null, message: "Attraction not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: result[0] }, { status: 200 });
        
    } catch (error) {
        console.error('Get attraction by region id fetch Error:', error.message);
        return NextResponse.json({ error: `MySQL Error: ${error.message}` }, { status: 500 });
    } finally {
        connection.release();
    }
}