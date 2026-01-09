/**
 * VIN Decoder using NHTSA Vehicle API (free, no API key required)
 * https://vpic.nhtsa.dot.gov/api/
 */

export interface VinDecodedData {
  year: number;
  make: string;
  model: string;
  trim: string | null;
  bodyType: string | null;
  drivetrain: string | null;
  fuelType: string | null;
  engine: string | null;
  transmission: string | null;
  doors: number | null;
}

interface NHTSAResult {
  Variable: string;
  Value: string | null;
}

interface NHTSAResponse {
  Results: NHTSAResult[];
}

export async function decodeVin(vin: string): Promise<VinDecodedData | null> {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    );

    if (!response.ok) {
      console.error(`NHTSA API error: ${response.status}`);
      return null;
    }

    const data: NHTSAResponse = await response.json();
    const results = data.Results;

    // Helper to get value by variable name
    const getValue = (variableName: string): string | null => {
      const result = results.find((r) => r.Variable === variableName);
      return result?.Value && result.Value.trim() !== '' ? result.Value.trim() : null;
    };

    const yearStr = getValue('Model Year');
    const year = yearStr ? parseInt(yearStr, 10) : 0;
    const make = getValue('Make') || '';
    const model = getValue('Model') || '';

    if (!year || !make || !model) {
      console.error(`VIN decode incomplete for ${vin}: year=${year}, make=${make}, model=${model}`);
      return null;
    }

    // Map body class to our body types
    const bodyClass = getValue('Body Class');
    const bodyType = mapBodyType(bodyClass);

    // Map drivetrain
    const driveType = getValue('Drive Type');
    const drivetrain = mapDrivetrain(driveType);

    // Map fuel type
    const fuelTypePrimary = getValue('Fuel Type - Primary');
    const fuelType = mapFuelType(fuelTypePrimary);

    // Build engine string
    const displacement = getValue('Displacement (L)');
    const cylinders = getValue('Engine Number of Cylinders');
    const engineConfig = getValue('Engine Configuration');
    const engine = buildEngineString(displacement, cylinders, engineConfig);

    // Transmission
    const transStyle = getValue('Transmission Style');
    const transSpeeds = getValue('Transmission Speeds');
    const transmission = buildTransmissionString(transStyle, transSpeeds);

    return {
      year,
      make,
      model,
      trim: getValue('Trim') || getValue('Trim2'),
      bodyType,
      drivetrain,
      fuelType,
      engine,
      transmission,
      doors: getValue('Doors') ? parseInt(getValue('Doors')!, 10) : null,
    };
  } catch (error) {
    console.error(`Error decoding VIN ${vin}:`, error);
    return null;
  }
}

function mapBodyType(bodyClass: string | null): string | null {
  if (!bodyClass) return null;
  const lower = bodyClass.toLowerCase();

  if (lower.includes('suv') || lower.includes('sport utility')) return 'SUV';
  if (lower.includes('sedan')) return 'Sedan';
  if (lower.includes('truck') || lower.includes('pickup')) return 'Truck';
  if (lower.includes('coupe')) return 'Coupe';
  if (lower.includes('convertible')) return 'Convertible';
  if (lower.includes('van') || lower.includes('minivan')) return 'Minivan';
  if (lower.includes('wagon')) return 'Wagon';
  if (lower.includes('hatchback')) return 'Hatchback';
  if (lower.includes('crossover')) return 'SUV';

  return bodyClass;
}

function mapDrivetrain(driveType: string | null): string | null {
  if (!driveType) return null;
  const lower = driveType.toLowerCase();

  if (lower.includes('4wd') || lower.includes('4x4') || lower.includes('four wheel')) return '4WD';
  if (lower.includes('awd') || lower.includes('all wheel') || lower.includes('all-wheel')) return 'AWD';
  if (lower.includes('fwd') || lower.includes('front wheel') || lower.includes('front-wheel')) return 'FWD';
  if (lower.includes('rwd') || lower.includes('rear wheel') || lower.includes('rear-wheel')) return 'RWD';

  return driveType;
}

function mapFuelType(fuelType: string | null): string | null {
  if (!fuelType) return null;
  const lower = fuelType.toLowerCase();

  if (lower.includes('gasoline') || lower.includes('gas')) return 'Gasoline';
  if (lower.includes('diesel')) return 'Diesel';
  if (lower.includes('electric')) return 'Electric';
  if (lower.includes('hybrid')) return 'Hybrid';
  if (lower.includes('flex') || lower.includes('e85')) return 'Flex Fuel';

  return fuelType;
}

function buildEngineString(
  displacement: string | null,
  cylinders: string | null,
  config: string | null
): string | null {
  const parts: string[] = [];

  if (displacement) {
    parts.push(`${displacement}L`);
  }

  if (cylinders) {
    if (config && config.toLowerCase().includes('v')) {
      parts.push(`V${cylinders}`);
    } else {
      parts.push(`${cylinders}-Cylinder`);
    }
  }

  return parts.length > 0 ? parts.join(' ') : null;
}

function buildTransmissionString(style: string | null, speeds: string | null): string | null {
  if (!style) return null;

  const lower = style.toLowerCase();
  let type = 'Automatic';

  if (lower.includes('manual')) type = 'Manual';
  else if (lower.includes('cvt')) type = 'CVT';
  else if (lower.includes('automated manual') || lower.includes('dct')) type = 'Automated Manual';

  if (speeds) {
    return `${speeds}-Speed ${type}`;
  }

  return type;
}
