import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM category ORDER BY name ASC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Category Fetch Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}