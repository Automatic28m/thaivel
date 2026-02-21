import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request) {
    const connection = await pool.getConnection();

    try {
        const { searchParams } = new URL(request.url);
        const attractionId = searchParams.get('id');

        if (!attractionId) {
            return NextResponse.json({ error: "Attraction ID is required" }, { status: 400 });
        }

        // 1. Fetch the file paths from MySQL before deleting the record
        const [attraction] = await connection.execute(
            `SELECT thumbnail FROM attractions WHERE id = ?`, 
            [attractionId]
        );

        const [photos] = await connection.execute(
            `SELECT file_path FROM attraction_photos WHERE id = ?`, 
            [attractionId]
        );

        if (attraction.length === 0) {
            return NextResponse.json({ error: "Attraction not found" }, { status: 404 });
        }

        await connection.beginTransaction();

        // 2. Delete the database records
        // Note: attraction_photos will delete automatically if ON DELETE CASCADE is set
        const [result] = await connection.execute(
            `DELETE FROM attractions WHERE id = ?`, 
            [attractionId]
        );

        // 3. Physically remove files from the project directory
        const publicDir = path.join(process.cwd(), 'public');

        // Remove Thumbnail
        if (attraction[0].thumbnail) {
            const thumbPath = path.join(publicDir, attraction[0].thumbnail);
            if (fs.existsSync(thumbPath)) {
                fs.unlinkSync(thumbPath);
            }
        }

        // Remove all Album Photos
        photos.forEach((photo) => {
            const photoPath = path.join(publicDir, photo.file_path);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        });

        await connection.commit();

        return NextResponse.json({ 
            success: true, 
            message: "Database record and physical files deleted successfully." 
        }, { status: 200 });

    } catch (err) {
        await connection.rollback();
        console.error('🔥 Delete Error:', err.message);
        return NextResponse.json({ 
            error: `Delete Error: ${err.message}` 
        }, { status: 500 });
    } finally {
        connection.release();
    }
}