import { NextRequest } from 'next/server';

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

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Content-Length': response.headers.get('content-length') || '',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
