/**
 * Vehicle feature parsing and categorization utilities.
 * Features are stored as JSON array strings in the Car.features column.
 */

export type FeatureCategory =
  | 'Safety'
  | 'Audio & Entertainment'
  | 'Comfort & Convenience'
  | 'Exterior'
  | 'Performance'
  | 'Technology'
  | 'Other';

const CATEGORY_KEYWORDS: Record<FeatureCategory, string[]> = {
  Safety: [
    'abs', 'airbag', 'air bag', 'brake', 'stability', 'traction',
    'blind spot', 'blind-spot', 'collision', 'lane departure', 'lane keep',
    'pre-collision', 'precollision', 'safety', 'seatbelt', 'seat belt',
    'child', 'pedestrian', 'rear cross', 'emergency', 'parking sensor',
    'backup sensor', 'anti-lock', 'anti lock', 'impact', 'crumple',
    'rollover', 'tire pressure', 'tpms', 'daytime running',
    'adaptive cruise', 'forward collision', 'automatic emergency',
  ],
  'Audio & Entertainment': [
    'speaker', 'audio', 'radio', 'bluetooth', 'usb', 'aux',
    'cd player', 'satellite', 'siriusxm', 'sirius', 'xm',
    'entertainment', 'sound', 'subwoofer', 'amplifier', 'harman',
    'jbl', 'mark levinson', 'bose', 'bang & olufsen', 'b&o',
    'mp3', 'hd radio', 'apple carplay', 'carplay', 'android auto',
    'wireless charging', 'wi-fi', 'wifi', 'hotspot',
  ],
  'Comfort & Convenience': [
    'heated', 'ventilated', 'cooled', 'leather', 'power seat',
    'memory seat', 'lumbar', 'armrest', 'cup holder', 'climate',
    'air conditioning', 'a/c', 'dual zone', 'tri-zone', 'keyless',
    'push button', 'remote start', 'power window', 'power door',
    'power liftgate', 'power tailgate', 'power mirror', 'cruise control',
    'tilt', 'telescop', 'steering wheel', 'sun visor', 'vanity',
    'garage', 'homelink', 'rain sens', 'auto-dim', 'auto dim',
    'electrochromic', 'compass', 'universal garage', 'adjustable pedal',
    'seat', 'comfort', 'convenience', 'cargo', 'trunk', 'storage',
  ],
  Exterior: [
    'alloy', 'wheel', 'rim', 'tire', 'roof rack', 'spoiler',
    'running board', 'step', 'fog light', 'fog lamp', 'led',
    'headlight', 'headlamp', 'taillight', 'tail light', 'xenon',
    'hid', 'chrome', 'body-color', 'body color', 'paint',
    'moonroof', 'sunroof', 'panoramic', 'convertible', 'tonneau',
    'bed liner', 'bedliner', 'tow', 'trailer', 'hitch',
    'roof', 'fender', 'grille', 'bumper', 'molding', 'window tint',
    'privacy glass', 'wiper', 'mud', 'splash', 'skid plate',
  ],
  Performance: [
    'turbo', 'supercharge', 'engine', 'horsepower', 'torque',
    'cylinder', 'v6', 'v8', 'i4', 'i6', 'awd', '4wd', '4x4',
    'all-wheel', 'all wheel', 'four-wheel', 'four wheel',
    'sport mode', 'sport suspension', 'performance', 'exhaust',
    'transmission', 'cvt', 'manual', 'paddle shift', 'shift',
    'limited slip', 'differential', 'drive mode', 'eco mode',
    'hybrid', 'electric', 'ev', 'regenerative',
  ],
  Technology: [
    'navigation', 'gps', 'display', 'touchscreen', 'touch screen',
    'screen', 'camera', 'backup camera', 'rear camera', '360',
    'surround view', 'bird', 'head-up', 'heads-up', 'hud',
    'digital', 'instrument', 'smart', 'connected', 'app',
    'telematics', 'remote', 'ota', 'over-the-air',
    'voice', 'recognition', 'assistant', 'siri', 'alexa',
    'wireless', 'charge', 'qi', 'usb-c',
  ],
  Other: [],
};

/**
 * Parse a JSON string of features into an array.
 * Returns empty array for null/undefined/invalid input.
 */
export function parseFeatures(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter((f): f is string => typeof f === 'string' && f.trim() !== '');
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Categorize features into named groups using keyword matching.
 * Returns a Map where keys are category names and values are feature arrays.
 * Only includes categories that have at least one feature.
 */
export function categorizeFeatures(
  features: string[],
): Map<FeatureCategory, string[]> {
  const result = new Map<FeatureCategory, string[]>();
  const categories: FeatureCategory[] = [
    'Safety',
    'Audio & Entertainment',
    'Comfort & Convenience',
    'Exterior',
    'Performance',
    'Technology',
  ];

  for (const feature of features) {
    const lower = feature.toLowerCase();
    let matched = false;

    for (const category of categories) {
      const keywords = CATEGORY_KEYWORDS[category];
      if (keywords.some((kw) => lower.includes(kw))) {
        const existing = result.get(category) || [];
        existing.push(feature);
        result.set(category, existing);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const existing = result.get('Other') || [];
      existing.push(feature);
      result.set('Other', existing);
    }
  }

  return result;
}
