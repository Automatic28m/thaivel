import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(
            `SELECT count(*) as attraction_count FROM attractions;`
        );

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error('🔥 Fetch Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}