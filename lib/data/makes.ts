// Vehicle makes data for SEO pages
export const makes = {
  'toyota': { name: 'Toyota', slug: 'toyota', country: 'Japan', logo: '/makes/toyota.png' },
  'honda': { name: 'Honda', slug: 'honda', country: 'Japan', logo: '/makes/honda.png' },
  'ford': { name: 'Ford', slug: 'ford', country: 'USA', logo: '/makes/ford.png' },
  'chevrolet': { name: 'Chevrolet', slug: 'chevrolet', country: 'USA', logo: '/makes/chevrolet.png' },
  'nissan': { name: 'Nissan', slug: 'nissan', country: 'Japan', logo: '/makes/nissan.png' },
  'jeep': { name: 'Jeep', slug: 'jeep', country: 'USA', logo: '/makes/jeep.png' },
  'hyundai': { name: 'Hyundai', slug: 'hyundai', country: 'South Korea', logo: '/makes/hyundai.png' },
  'kia': { name: 'Kia', slug: 'kia', country: 'South Korea', logo: '/makes/kia.png' },
  'subaru': { name: 'Subaru', slug: 'subaru', country: 'Japan', logo: '/makes/subaru.png' },
  'mazda': { name: 'Mazda', slug: 'mazda', country: 'Japan', logo: '/makes/mazda.png' },
  'bmw': { name: 'BMW', slug: 'bmw', country: 'Germany', logo: '/makes/bmw.png' },
  'mercedes-benz': { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany', logo: '/makes/mercedes.png' },
  'audi': { name: 'Audi', slug: 'audi', country: 'Germany', logo: '/makes/audi.png' },
  'lexus': { name: 'Lexus', slug: 'lexus', country: 'Japan', logo: '/makes/lexus.png' },
  'volkswagen': { name: 'Volkswagen', slug: 'volkswagen', country: 'Germany', logo: '/makes/volkswagen.png' },
  'gmc': { name: 'GMC', slug: 'gmc', country: 'USA', logo: '/makes/gmc.png' },
  'ram': { name: 'RAM', slug: 'ram', country: 'USA', logo: '/makes/ram.png' },
  'dodge': { name: 'Dodge', slug: 'dodge', country: 'USA', logo: '/makes/dodge.png' },
  'buick': { name: 'Buick', slug: 'buick', country: 'USA', logo: '/makes/buick.png' },
  'cadillac': { name: 'Cadillac', slug: 'cadillac', country: 'USA', logo: '/makes/cadillac.png' },
};

export const makeSlugs = Object.keys(makes);
export type MakeData = typeof makes[keyof typeof makes];
