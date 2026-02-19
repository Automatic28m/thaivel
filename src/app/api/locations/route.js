import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const parentId = searchParams.get('parentId');

  try {
    let query = '';
    let values = [];

    if (type === 'provinces') {
      query = 'SELECT id, name_en FROM provinces ORDER BY name_en ASC';
    } else if (type === 'amphures') {
      query = 'SELECT id, name_en FROM amphures WHERE province_id = ? ORDER BY name_en ASC';
      values = [parentId];
    } else if (type === 'sub_districts') {
      query = 'SELECT id, name_en FROM sub_districts WHERE amphure_id = ? ORDER BY name_en ASC';
      values = [parentId];
    }

    const [rows] = await pool.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}