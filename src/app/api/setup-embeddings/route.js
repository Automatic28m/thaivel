import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM attractions');
        return NextResponse.json({
            success: true,
            message: 'Embedding setup is disabled in serverless mode to keep deployment size small.',
            attractionCount: count
        });

    } catch (error) {
        console.error("Embedding Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}