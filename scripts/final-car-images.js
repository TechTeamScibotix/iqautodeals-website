const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Using only verified working Wikipedia Commons URLs - one per car model
const carImages = {
  'Toyota Camry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/1280px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg',
  'Honda Accord': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/2021_Honda_Accord_Sport_2.0T%2C_front_8.7.21.jpg/1280px-2021_Honda_Accord_Sport_2.0T%2C_front_8.7.21.jpg',
  'BMW 3 Series': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW_G20_IMG_0167.jpg/1280px-BMW_G20_IMG_0167.jpg',
  'Mercedes-Benz C-Class': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/2022_Mercedes-Benz_C_300_4MATIC_sedan_in_Polar_White%2C_Front_Left%2C_09-30-2022.jpg/1280px-2022_Mercedes-Benz_C_300_4MATIC_sedan_in_Polar_White%2C_Front_Left%2C_09-30-2022.jpg',
  'Lexus ES': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/2019_Lexus_ES_350_in_Sonic_Quartz%2C_Front_Left%2C_07-07-2021.jpg/1280px-2019_Lexus_ES_350_in_Sonic_Quartz%2C_Front_Left%2C_07-07-2021.jpg',
  'Audi A4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/2020_Audi_A4_40_TFSI_S_line_Front.jpg/1280px-2020_Audi_A4_40_TFSI_S_line_Front.jpg',
  'Tesla Model 3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_AWD_Front.jpg/1280px-2019_Tesla_Model_3_Performance_AWD_Front.jpg',
  'Acura TLX': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/2021_Acura_TLX_A-Spec_SH-AWD_in_Performance_Red%2C_Front_Right%2C_08-28-2021.jpg/1280px-2021_Acura_TLX_A-Spec_SH-AWD_in_Performance_Red%2C_Front_Right%2C_08-28-2021.jpg',
  'Mazda 6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/2018_Mazda6_2.2d_Sport_Nav%2B_Skyactiv-D_automatic_2.2_Front.jpg/1280px-2018_Mazda6_2.2d_Sport_Nav%2B_Skyactiv-D_automatic_2.2_Front.jpg',
  'Genesis G70': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/2019_Genesis_G70_3.3T_Design_AWD%2C_front_7.3.19.jpg/1280px-2019_Genesis_G70_3.3T_Design_AWD%2C_front_7.3.19.jpg',
  'Hyundai Sonata': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/2020_Hyundai_Sonata_Limited%2C_Front_Left%2C_05-25-2020.jpg/1280px-2020_Hyundai_Sonata_Limited%2C_Front_Left%2C_05-25-2020.jpg',
  'Kia K5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/2021_Kia_K5_GT-Line_in_Everlasting_Silver%2C_Front_Right%2C_03-20-2021.jpg/1280px-2021_Kia_K5_GT-Line_in_Everlasting_Silver%2C_Front_Right%2C_03-20-2021.jpg',
  'Nissan Altima': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/2019_Nissan_Altima_SL_AWD%2C_front_5.3.20.jpg/1280px-2019_Nissan_Altima_SL_AWD%2C_front_5.3.20.jpg',
  'Volkswagen Passat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/2020_Volkswagen_Passat_SEL_2.0L%2C_front_8.16.20.jpg/1280px-2020_Volkswagen_Passat_SEL_2.0L%2C_front_8.16.20.jpg',
  'Subaru Legacy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2020_Subaru_Legacy_Premium%2C_front_10.25.20.jpg/1280px-2020_Subaru_Legacy_Premium%2C_front_10.25.20.jpg',
  'Toyota RAV4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/2019_Toyota_RAV4_Adventure_AWD%2C_front_6.28.19.jpg/1280px-2019_Toyota_RAV4_Adventure_AWD%2C_front_6.28.19.jpg',
  'Honda CR-V': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/2020_Honda_CR-V_Touring_AWD%2C_front_6.15.19.jpg/1280px-2020_Honda_CR-V_Touring_AWD%2C_front_6.15.19.jpg',
  'Mazda CX-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/2017_Mazda_CX-5_%28KF%29_Maxx_2WD_wagon_%282018-11-02%29_01.jpg/1280px-2017_Mazda_CX-5_%28KF%29_Maxx_2WD_wagon_%282018-11-02%29_01.jpg',
  'Lexus RX': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2020_Lexus_RX_350_F_Sport_in_Caviar%2C_Front_Right%2C_10-26-2019.jpg/1280px-2020_Lexus_RX_350_F_Sport_in_Caviar%2C_Front_Right%2C_10-26-2019.jpg',
  'BMW X3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2018_BMW_X3_xDrive20d_xLine_Automatic_2.0_Front.jpg/1280px-2018_BMW_X3_xDrive20d_xLine_Automatic_2.0_Front.jpg',
  'Audi Q5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/2018_Audi_Q5_TFSi_Quattro_S_Line_2.0_Front.jpg/1280px-2018_Audi_Q5_TFSi_Quattro_S_Line_2.0_Front.jpg',
  'Mercedes-Benz GLC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2020_Mercedes-Benz_GLC300_4MATIC%2C_front_2.23.20.jpg/1280px-2020_Mercedes-Benz_GLC300_4MATIC%2C_front_2.23.20.jpg',
  'Volvo XC60': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/2018_Volvo_XC60_2.0_D4_Inscription_Pro_AWD_Geartronic.jpg/1280px-2018_Volvo_XC60_2.0_D4_Inscription_Pro_AWD_Geartronic.jpg',
  'Acura RDX': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2019_Acura_RDX_A-Spec_SH-AWD%2C_front_8.17.19.jpg/1280px-2019_Acura_RDX_A-Spec_SH-AWD%2C_front_8.17.19.jpg',
  'Infiniti QX50': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2019_Infiniti_QX50_Essential_AWD%2C_front_4.6.19.jpg/1280px-2019_Infiniti_QX50_Essential_AWD%2C_front_4.6.19.jpg',
  'Hyundai Tucson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/2022_Hyundai_Tucson_Limited%2C_front_2.6.22.jpg/1280px-2022_Hyundai_Tucson_Limited%2C_front_2.6.22.jpg',
  'Kia Sportage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/2023_Kia_Sportage_X-Line_in_Dawning_Red%2C_Front_Right%2C_07-30-2022.jpg/1280px-2023_Kia_Sportage_X-Line_in_Dawning_Red%2C_Front_Right%2C_07-30-2022.jpg',
  'Subaru Outback': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2020_Subaru_Outback_Limited_XT%2C_front_10.25.20.jpg/1280px-2020_Subaru_Outback_Limited_XT%2C_front_10.25.20.jpg',
  'Volkswagen Atlas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/2018_Volkswagen_Atlas_SEL_Premium_4Motion%2C_front_6.17.18.jpg/1280px-2018_Volkswagen_Atlas_SEL_Premium_4Motion%2C_front_6.17.18.jpg',
  'Mazda CX-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/2019_Mazda_CX-9_Grand_Touring_AWD%2C_front_4.20.19.jpg/1280px-2019_Mazda_CX-9_Grand_Touring_AWD%2C_front_4.20.19.jpg',
  'Ford F-150': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/2021_Ford_F-150_Lariat_crew_cab%2C_front_3.13.21.jpg/1280px-2021_Ford_F-150_Lariat_crew_cab%2C_front_3.13.21.jpg',
  'Chevrolet Silverado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/2019_Chevrolet_Silverado_LT_Trail_Boss_Crew_Cab%2C_front_5.19.19.jpg/1280px-2019_Chevrolet_Silverado_LT_Trail_Boss_Crew_Cab%2C_front_5.19.19.jpg',
  'Ram 1500': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2019_RAM_1500_Laramie_Longhorn_Crew_Cab%2C_front_6.28.19.jpg/1280px-2019_RAM_1500_Laramie_Longhorn_Crew_Cab%2C_front_6.28.19.jpg',
  'GMC Sierra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2019_GMC_Sierra_Denali_Crew_Cab%2C_front_7.4.19.jpg/1280px-2019_GMC_Sierra_Denali_Crew_Cab%2C_front_7.4.19.jpg',
  'Toyota Tacoma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/2020_Toyota_Tacoma_TRD_Sport_Double_Cab%2C_front_6.28.20.jpg/1280px-2020_Toyota_Tacoma_TRD_Sport_Double_Cab%2C_front_6.28.20.jpg',
  'Toyota Tundra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2022_Toyota_Tundra_Limited_TRD_Off-Road_in_Lunar_Rock%2C_Front_Right%2C_03-26-2022.jpg/1280px-2022_Toyota_Tundra_Limited_TRD_Off-Road_in_Lunar_Rock%2C_Front_Right%2C_03-26-2022.jpg',
  'Chevrolet Colorado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2019_Chevrolet_Colorado_Z71_crew_cab%2C_front_11.2.19.jpg/1280px-2019_Chevrolet_Colorado_Z71_crew_cab%2C_front_11.2.19.jpg',
  'Nissan Frontier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2022_Nissan_Frontier_PRO-4X_in_Baja_Storm%2C_Front_Left%2C_08-12-2021.jpg/1280px-2022_Nissan_Frontier_PRO-4X_in_Baja_Storm%2C_Front_Left%2C_08-12-2021.jpg',
  'Jeep Wrangler': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2018_Jeep_Wrangler_JL_Sahara_2.0L_front_4.25.18.jpg/1280px-2018_Jeep_Wrangler_JL_Sahara_2.0L_front_4.25.18.jpg',
  'Ford Bronco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/2021_Ford_Bronco_Badlands_front%2C_6th_generation_%2851327285000%29.jpg/1280px-2021_Ford_Bronco_Badlands_front%2C_6th_generation_%2851327285000%29.jpg',
  'Porsche Macan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2019_Porsche_Macan_S_facelift%2C_front_5.12.19.jpg/1280px-2019_Porsche_Macan_S_facelift%2C_front_5.12.19.jpg',
  'BMW X5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/2019_BMW_X5_xDrive40i_in_Manhattan%2C_front_9.8.19.jpg/1280px-2019_BMW_X5_xDrive40i_in_Manhattan%2C_front_9.8.19.jpg',
  'Mercedes-Benz GLE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/2020_Mercedes-Benz_GLE_450_4MATIC%2C_front_11.2.19.jpg/1280px-2020_Mercedes-Benz_GLE_450_4MATIC%2C_front_11.2.19.jpg',
  'Audi Q7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/2020_Audi_Q7_55_TFSI_Prestige_S_line%2C_front_9.5.20.jpg/1280px-2020_Audi_Q7_55_TFSI_Prestige_S_line%2C_front_9.5.20.jpg',
  'Cadillac Escalade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2021_Cadillac_Escalade_Sport_Platinum%2C_front_9.27.20.jpg/1280px-2021_Cadillac_Escalade_Sport_Platinum%2C_front_9.27.20.jpg',
  'Lincoln Navigator': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2018_Lincoln_Navigator_Reserve%2C_front_5.27.18.jpg/1280px-2018_Lincoln_Navigator_Reserve%2C_front_5.27.18.jpg',
  'Land Rover Range Rover Sport': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2018_Land_Rover_Range_Rover_Sport_Autobiography_Dynamic_front_4.28.18.jpg/1280px-2018_Land_Rover_Range_Rover_Sport_Autobiography_Dynamic_front_4.28.18.jpg',
  'Maserati Levante': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2017_Maserati_Levante_S_3.0L%2C_front_1.21.18.jpg/1280px-2017_Maserati_Levante_S_3.0L%2C_front_1.21.18.jpg',
  'Alfa Romeo Stelvio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/2018_Alfa_Romeo_Stelvio_Ti_AWD%2C_front_8.25.18.jpg/1280px-2018_Alfa_Romeo_Stelvio_Ti_AWD%2C_front_8.25.18.jpg',
  'Genesis GV80': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2021_Genesis_GV80_Advanced%2B_2.5T_AWD%2C_front_8.7.21.jpg/1280px-2021_Genesis_GV80_Advanced%2B_2.5T_AWD%2C_front_8.7.21.jpg',
  'Chevrolet Camaro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/2019_Chevrolet_Camaro_2SS_coupe%2C_front_8.25.18.jpg/1280px-2019_Chevrolet_Camaro_2SS_coupe%2C_front_8.25.18.jpg'
};

// Model name mapping
const modelMap = {
  'Camry SE': 'Toyota Camry',
  'Accord Touring': 'Honda Accord',
  '330i xDrive': 'BMW 3 Series',
  'C300 4MATIC': 'Mercedes-Benz C-Class',
  'ES 350': 'Lexus ES',
  'A4 Prestige': 'Audi A4',
  'Model 3 Long Range': 'Tesla Model 3',
  'TLX A-Spec': 'Acura TLX',
  'Mazda6 Signature': 'Mazda 6',
  'G70 3.3T Sport': 'Genesis G70',
  'Sonata SEL Plus': 'Hyundai Sonata',
  'K5 GT-Line': 'Kia K5',
  'Altima SR': 'Nissan Altima',
  'Passat SEL': 'Volkswagen Passat',
  'Legacy Limited': 'Subaru Legacy',
  'RAV4 XLE Premium': 'Toyota RAV4',
  'CR-V EX-L': 'Honda CR-V',
  'CX-5 Turbo': 'Mazda CX-5',
  'RX 350 F Sport': 'Lexus RX',
  'X3 M40i': 'BMW X3',
  'Q5 Premium Plus': 'Audi Q5',
  'GLC 300 4MATIC': 'Mercedes-Benz GLC',
  'XC60 T6 Inscription': 'Volvo XC60',
  'RDX A-Spec': 'Acura RDX',
  'QX50 Sensory': 'Infiniti QX50',
  'Tucson Limited': 'Hyundai Tucson',
  'Sportage SX-Prestige': 'Kia Sportage',
  'Outback Touring XT': 'Subaru Outback',
  'Atlas SEL Premium': 'Volkswagen Atlas',
  'CX-9 Signature': 'Mazda CX-9',
  'F-150 Lariat': 'Ford F-150',
  'Silverado 1500 High Country': 'Chevrolet Silverado',
  '1500 Laramie': 'Ram 1500',
  '1500': 'Ram 1500',
  'Sierra 1500 Denali': 'GMC Sierra',
  'Tacoma TRD Pro': 'Toyota Tacoma',
  'Tundra TRD Pro': 'Toyota Tundra',
  'Colorado ZR2': 'Chevrolet Colorado',
  'Frontier Pro-4X': 'Nissan Frontier',
  'Wrangler Rubicon 4xe': 'Jeep Wrangler',
  'Bronco Badlands': 'Ford Bronco',
  'Macan S': 'Porsche Macan',
  'X5 M50i': 'BMW X5',
  'GLE 450 4MATIC': 'Mercedes-Benz GLE',
  'Q7 Prestige': 'Audi Q7',
  'Escalade Premium Luxury': 'Cadillac Escalade',
  'Navigator Reserve': 'Lincoln Navigator',
  'Range Rover Sport HSE': 'Land Rover Range Rover Sport',
  'Levante GT': 'Maserati Levante',
  'Stelvio Ti Sport': 'Alfa Romeo Stelvio',
  'GV80 3.5T Prestige': 'Genesis GV80',
  'Camaro': 'Chevrolet Camaro'
};

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
    request.on('error', reject);
    request.setTimeout(60000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  console.log('Updating car images with Wikipedia Commons photos...\n');

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true }
  });

  let updated = 0, failed = 0;

  for (const car of cars) {
    const key = modelMap[car.model] || `${car.make} ${car.model.split(' ')[0]}`;
    const imgUrl = carImages[key];

    if (!imgUrl) {
      console.log(`⚠ No image: ${car.make} ${car.model}`);
      failed++;
      continue;
    }

    try {
      console.log(`${car.year} ${car.make} ${car.model}...`);
      const buffer = await downloadImage(imgUrl);
      const blob = await put(`cars/${car.vin.toLowerCase()}-final.jpg`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: true
      });

      await prisma.car.update({
        where: { vin: car.vin },
        data: { photos: JSON.stringify([blob.url]) }
      });

      console.log(`✓ Done`);
      updated++;
    } catch (error) {
      console.log(`✗ ${error.message}`);
      failed++;
    }
  }

  console.log(`\nUpdated: ${updated}, Failed: ${failed}`);
}

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';
main().catch(console.error).finally(() => prisma.$disconnect());
