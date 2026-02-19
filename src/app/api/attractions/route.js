import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { 
      name, 
      sub_district_id, 
      location, 
      openHour, 
      tel, 
      ig, 
      facebook, 
      googleMapsUrl, 
      description, 
      thumbnail 
    } = body;

    const [result] = await pool.execute(
      `INSERT INTO attractions (
        name, sub_district_id, location, open_hour, 
        tel, ig, facebook, google_maps_url, description, thumbnail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        sub_district_id,
        location, 
        openHour, 
        tel, 
        ig, 
        facebook, 
        googleMapsUrl, 
        description, 
        thumbnail
      ]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId 
    }, { status: 201 });

  } catch (error) {
    // UPDATED: Now the frontend alert will show the ACTUAL MySQL error message
    console.error('🔥 MySQL Insertion Error:', error.message);
    return NextResponse.json({ 
      error: `MySQL Error: ${error.message}` 
    }, { status: 500 });
  }
}