import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, claimId } = await request.json();

        if (!imageUrl || !claimId) {
            return NextResponse.json(
                { error: 'Missing imageUrl or claimId' },
                { status: 400 }
            );
        }

        console.log(`Uploading image to Cloudinary for claim ${claimId}`);

        // Upload image from URL to Cloudinary (simple approach from docs)
        const uploadResult = await cloudinary.uploader
            .upload(imageUrl, {
                public_id: `dreamprint-${claimId}-${Date.now()}`,
            })
            .catch((error) => {
                console.log('Cloudinary upload error:', error);
                throw error;
            });

        console.log('Upload successful:', uploadResult.secure_url);

        return NextResponse.json({
            success: true,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        });

    } catch (error: unknown) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image to Cloudinary' },
            { status: 500 }
        );
    }
}
