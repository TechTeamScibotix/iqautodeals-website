import { NextRequest } from 'next/server';
import sharp from 'sharp';

const BLOB_HOST = 'yzkbvk1txue5y0ml.public.blob.vercel-storage.com';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const imagePath = path.join('/');
  const blobUrl = `https://${BLOB_HOST}/${imagePath}`;

  const response = await fetch(blobUrl);

  if (!response.ok) {
    return new Response('Image not found', { status: 404 });
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Resize to 640px wide, JPEG q75 — targets under 200KB for ChatGPT inline rendering
  const resized = await sharp(buffer)
    .resize(640, undefined, { withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer();

  return new Response(new Uint8Array(resized), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': resized.length.toString(),
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
