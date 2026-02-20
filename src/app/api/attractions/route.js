import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const body = await request.json();
    const { method, ...data } = body;

    await connection.beginTransaction();
    let responseData = { success: true };

    switch (method) {
      case 'insert': {
        const {
          name, sub_district_id, category_id, location,
          openHour, tel, igUrl, facebookUrl, googleMapsUrl,
          description, thumbnail, albumFiles
        } = data;

        const [result] = await connection.execute(
          `INSERT INTO attractions (
            name, sub_district_id, category_id, location, open_hour, 
            tel, ig, facebook, google_maps_url, description, thumbnail
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, sub_district_id, category_id, location, openHour, tel, igUrl, facebookUrl, googleMapsUrl, description, thumbnail]
        );

        const attractionId = result.insertId;

        if (albumFiles && albumFiles.length > 0) {
          const photoValues = albumFiles.map(file => [attractionId, file]);
          await connection.query('INSERT INTO attraction_photos (attraction_id, file_path) VALUES ?', [photoValues]);
        }
        responseData.id = attractionId;
        break;
      }

      case 'update': {
        const { id, name, location, description } = data;
        await connection.execute(
          `UPDATE attractions SET name = ?, location = ?, description = ? WHERE id = ?`,
          [name, location, description, id]
        );
        break;
      }

      case 'delete': {
        const { id } = data;
        // attraction_photos will delete automatically if ON DELETE CASCADE is set
        await connection.execute(`DELETE FROM attractions WHERE id = ?`, [id]);
        break;
      }

      default:
        throw new Error('Invalid method provided');
    }

    await connection.commit();
    return NextResponse.json(responseData, { status: method === 'insert' ? 201 : 200 });

  } catch (error) {
    await connection.rollback();
    console.error(`🔥 ${body?.method || 'API'} Error:`, error.message);
    return NextResponse.json({ error: `MySQL Error: ${error.message}` }, { status: 500 });
  } finally {
    connection.release();
  }
}