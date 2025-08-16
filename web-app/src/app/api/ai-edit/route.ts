import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        const { imageData, prompt } = await req.json();

        if (!imageData) {
            return NextResponse.json({ error: "Missing imageData." }, { status: 400 });
        }

        const input = {
            prompt: prompt || "Transform the image into the style of Studio Ghibli",
            input_image: imageData,
            aspect_ratio: "match_input_image",
            output_format: "jpg",
            go_fast: true,
            num_outputs: 1,
        };

        const output = await replicate.run("black-forest-labs/flux-kontext-pro", { input });

        const editedImageUrl = (output as { url(): string }).url();

        if (!editedImageUrl) {
            return NextResponse.json({ error: "No edited image generated." }, { status: 500 });
        }

        return NextResponse.json({ editedImageUrl });
    } catch (error: unknown) {
        console.error("AI image editing error:", error);
        return NextResponse.json({ error: "Image editing failed." }, { status: 500 });
    }
}
