/**
 * Photo Downloader/Uploader
 * Downloads images from dealer sites and uploads to Vercel Blob
 */

import { put } from '@vercel/blob';

export interface UploadedPhoto {
  originalUrl: string;
  blobUrl: string;
}

/**
 * Download an image from a URL and upload it to Vercel Blob
 */
export async function downloadAndUploadPhoto(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to download image: ${imageUrl} - ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Only accept image types
    if (!contentType.startsWith('image/')) {
      console.error(`Not an image: ${imageUrl} - ${contentType}`);
      return null;
    }

    // Get the image as a blob
    const imageBlob = await response.blob();

    // Check file size (max 10MB)
    if (imageBlob.size > 10 * 1024 * 1024) {
      console.error(`Image too large: ${imageUrl} - ${imageBlob.size} bytes`);
      return null;
    }

    // Determine file extension
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';

    const finalFilename = `${filename}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(finalFilename, imageBlob, {
      access: 'public',
      contentType,
    });

    return blob.url;
  } catch (error) {
    console.error(`Error uploading photo ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Download and upload multiple photos for a vehicle
 * Returns array of Vercel Blob URLs, or original URLs as fallback
 */
export async function uploadVehiclePhotos(
  photoUrls: string[],
  vin: string,
  useOriginalAsFallback: boolean = true
): Promise<string[]> {
  // Check if BLOB_READ_WRITE_TOKEN is available
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

  // If no token and fallback enabled, just return original URLs
  if (!hasBlobToken && useOriginalAsFallback) {
    console.log(`No BLOB_READ_WRITE_TOKEN, using original URLs for ${vin}`);
    return photoUrls;
  }

  const uploadedUrls: string[] = [];

  // Process photos in parallel with a limit
  const BATCH_SIZE = 5;

  for (let i = 0; i < photoUrls.length; i += BATCH_SIZE) {
    const batch = photoUrls.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map((url, index) => {
        const photoIndex = i + index + 1;
        const filename = `inventory/${vin}/${vin}-photo-${photoIndex}`;
        return downloadAndUploadPhoto(url, filename);
      })
    );

    // For each result, use uploaded URL or fall back to original
    results.forEach((uploadedUrl, index) => {
      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
      } else if (useOriginalAsFallback) {
        // Fall back to original URL if upload failed
        uploadedUrls.push(batch[index]);
      }
    });
  }

  return uploadedUrls;
}

/**
 * Clean photo URL - remove query params that might cause issues
 * and ensure it's a valid absolute URL
 */
export function cleanPhotoUrl(url: string, baseUrl?: string): string | null {
  try {
    // Handle relative URLs
    if (url.startsWith('/') && baseUrl) {
      const base = new URL(baseUrl);
      url = `${base.protocol}//${base.host}${url}`;
    }

    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      url = `https:${url}`;
    }

    const parsed = new URL(url);

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Return the cleaned URL
    return parsed.toString();
  } catch {
    return null;
  }
}
