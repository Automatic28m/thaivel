import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM geographies ORDER BY name ASC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Regions Fetch Error', error.message);
        return NextResponse.json(
            { error: 'Failed to fetch regions '},
            { status: 500 }
        );
    }
}