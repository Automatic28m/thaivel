import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const formData = await request.formData();
    
    // 1. Must capture the ID for the WHERE clause
    const id = formData.get('id'); 
    const name = formData.get('name');
    const sub_district_id = formData.get('sub_district_id');
    const category_id = formData.get('category_id');
    const location = formData.get('location');
    const openHour = formData.get('openHour');
    const tel = formData.get('tel');
    const igUrl = formData.get('igUrl');
    const facebookUrl = formData.get('facebookUrl');
    const tiktokUrl = formData.get('tiktokUrl');
    const googleMapsUrl = formData.get('googleMapsUrl');
    const description = formData.get('description');

    const thumbnailFile = formData.get('thumbnailFile');
    const albumFiles = formData.getAll('albumFiles');

    const namePrefix = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    await connection.beginTransaction();

    // 2. Fetch current record to handle file cleanup
    const [currentData] = await connection.execute(
      `SELECT thumbnail FROM attractions WHERE id = ?`, [id]
    );

    let thumbnailPath = currentData[0]?.thumbnail || "";

    // 3. Update Thumbnail only if a new one is provided
    if (thumbnailFile && typeof thumbnailFile !== 'string') {
      // Remove old file if it exists
      if (thumbnailPath) {
        const oldPath = path.join(process.cwd(), 'public', thumbnailPath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailPath = `/images/attractions/${namePrefix}-thumbnail.jpg`;
      fs.writeFileSync(path.join(process.cwd(), 'public', thumbnailPath), buffer);
    }

    // 4. Update Main Attraction Data
    await connection.execute(
      `UPDATE attractions SET 
            name = ?, sub_district_id = ?, category_id = ?, location = ?, 
            open_hour = ?, tel = ?, igUrl = ?, facebookUrl = ?, 
            tiktokUrl = ?, google_maps_url = ?, description = ?, thumbnail = ?
       WHERE id = ?`,
      [name, sub_district_id, category_id, location, openHour, tel, igUrl, facebookUrl, tiktokUrl, googleMapsUrl, description, thumbnailPath, id]
    );

    // 5. Handle Album Updates
    if (albumFiles && albumFiles.length > 0 && typeof albumFiles[0] !== 'string') {
        // Option A: Clear old album photos and replace (Simpler)
        const [oldPhotos] = await connection.execute(`SELECT file_path FROM attraction_photos WHERE attraction_id = ?`, [id]);
        oldPhotos.forEach(p => {
            const pPath = path.join(process.cwd(), 'public', p.file_path);
            if (fs.existsSync(pPath)) fs.unlinkSync(pPath);
        });
        await connection.execute(`DELETE FROM attraction_photos WHERE attraction_id = ?`, [id]);

        const photoEntries = [];
        for (let i = 0; i < albumFiles.length; i++) {
            const file = albumFiles[i];
            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = `/images/attractions/${namePrefix}-${i + 1}.jpg`;
            fs.writeFileSync(path.join(process.cwd(), 'public', filePath), buffer);
            photoEntries.push([id, filePath]);
        }
        await connection.query('INSERT INTO attraction_photos (attraction_id, file_path) VALUES ?', [photoEntries]);
    }

    await connection.commit();
    return NextResponse.json({ success: true, message: "Updated successfully" }, { status: 200 });

  } catch (error) {
    await connection.rollback();
    console.error(`Update Error:`, error.message);
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  } finally {
    connection.release();
  }
}