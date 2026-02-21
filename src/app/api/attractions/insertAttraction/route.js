import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const formData = await request.formData();
    
    // Extract text fields
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

    // Extract files
    const thumbnailFile = formData.get('thumbnailFile');
    const albumFiles = formData.getAll('albumFiles'); // Returns an array of file objects

    const namePrefix = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const uploadDir = path.join(process.cwd(), 'public/images/attractions');

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await connection.beginTransaction();

    // 2. Save Thumbnail to Disk
    let thumbnailPath = "";
    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailPath = `/images/attractions/${namePrefix}-thumbnail.jpg`;
      fs.writeFileSync(path.join(process.cwd(), 'public', thumbnailPath), buffer);
    }

    // 3. Insert Main Attraction Data
    const [result] = await connection.execute(
      `INSERT INTO attractions (
            name, sub_district_id, category_id, location, open_hour, 
            tel, igUrl, facebookUrl, tiktokUrl, google_maps_url, description, thumbnail
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sub_district_id, category_id, location, openHour, tel, igUrl, facebookUrl, tiktokUrl, googleMapsUrl, description, thumbnailPath]
    );

    const attractionId = result.insertId;

    // 4. Save Album Photos to Disk and DB
    if (albumFiles && albumFiles.length > 0) {
      const photoEntries = [];
      
      for (let i = 0; i < albumFiles.length; i++) {
        const file = albumFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = `/images/attractions/${namePrefix}-${i + 1}.jpg`;
        
        fs.writeFileSync(path.join(process.cwd(), 'public', filePath), buffer);
        photoEntries.push([attractionId, filePath]);
      }

      await connection.query(
        'INSERT INTO attraction_photos (attraction_id, file_path) VALUES ?',
        [photoEntries]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true, id: attractionId }, { status: 201 });

  } catch (error) {
    await connection.rollback();
    console.error(`Upload Error:`, error.message);
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  } finally {
    connection.release();
  }
}