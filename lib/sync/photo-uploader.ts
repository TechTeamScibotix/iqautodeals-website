/**
 * Photo Downloader/Uploader
 * Downloads images from dealer sites and uploads to Vercel Blob
 */

import { put } from '@vercel/blob';
import { createHash } from 'crypto';

export interface UploadedPhoto {
  originalUrl: string;
  blobUrl: string;
}

// SHA-256 hashes of known dealer placeholder images ("Photos Coming Soon" red tarp).
// These are exact content hashes — only skip images that match byte-for-byte.
const PLACEHOLDER_HASHES = new Set([
  '049b231b860c4c54b23335b3e39d70cc566be1e79ad069f828e115f278f69055', // Cool Springs red tarp
  '2a4ee647c675affdcbb0127aa3cfd4a512a611ea10ee4ab90eb40db7e145d765', // Cool Springs red tarp variant
]);

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

    // Get the image as arrayBuffer for hashing, then convert to blob for upload
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check file size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      console.error(`Image too large: ${imageUrl} - ${buffer.length} bytes`);
      return null;
    }

    // Skip known dealer placeholder images by content hash
    const hash = createHash('sha256').update(buffer).digest('hex');
    if (PLACEHOLDER_HASHES.has(hash)) {
      console.log(`Skipping placeholder image (hash match): ${imageUrl}`);
      return 'SKIP_PLACEHOLDER';
    }

    // Determine file extension
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';

    const finalFilename = `${filename}.${extension}`;

    // Upload to Vercel Blob (allow overwrite for re-syncs)
    const blob = await put(finalFilename, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
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
      if (uploadedUrl === 'SKIP_PLACEHOLDER') {
        // Intentionally skipped placeholder image — do not add
      } else if (uploadedUrl) {
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
