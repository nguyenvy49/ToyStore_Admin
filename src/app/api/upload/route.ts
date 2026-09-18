import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import envConfig from "@/config/envConfig";

cloudinary.config({
  cloud_name: envConfig.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: envConfig.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      { folder: "tinymce" }
    );

    // ✅ Trả đúng format cho TinyMCE
    return NextResponse.json({
      location: uploadResult.secure_url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}