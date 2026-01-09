/**
 * Inventory Sync Module
 *
 * This module provides functionality to automatically sync dealer inventory
 * from external sources (like DealerOn websites) to IQ Auto Deals.
 *
 * Usage:
 *
 * 1. Configure a dealer's sync settings:
 *    POST /api/admin/dealer-sync
 *    {
 *      "dealerId": "xxx",
 *      "inventoryFeedUrl": "https://www.dealer-website.com",
 *      "inventoryFeedType": "dealeron",
 *      "autoSyncEnabled": true,
 *      "syncFrequencyDays": 2
 *    }
 *
 * 2. Manually trigger sync for a dealer:
 *    POST /api/sync
 *    { "dealerId": "xxx" }
 *
 * 3. Scheduled sync runs automatically via Vercel Cron (daily at 3 AM UTC)
 *    GET /api/sync (with CRON_SECRET authorization)
 *
 * Environment Variables:
 *   CRON_SECRET - Secret for authenticating cron requests
 *   ADMIN_SECRET - Secret for admin API access (optional, falls back to CRON_SECRET)
 */

export { decodeVin, type VinDecodedData } from './vin-decoder';
export { scrapeDealerOnInventory, type ScrapedVehicle, type ScrapeResult } from './dealeron-scraper';
export { uploadVehiclePhotos, downloadAndUploadPhoto, cleanPhotoUrl } from './photo-uploader';
export { syncDealerInventory, runScheduledSync, type SyncSummary } from './inventory-sync';
