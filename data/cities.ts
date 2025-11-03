import { City } from "../types/City";

export const bestCities: City[] = [
  {
    id: "1",
    name: "Hong Kong",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c",
    priceRange: "from $33.00 to $38.00",
    code: "HAN",
    country: "Việt Nam",
  },
  {
    id: "2",
    name: "San Antonio",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
    priceRange: "from $48.00 to $50.00",
    code: "HAN",
    country: "Việt Nam",
  },
];

export const CITIES_DATA: City[] = [
  { id: "1", name: "Hà Nội", code: "HAN", country: "Việt Nam", image: "null", priceRange: "null" },
  { id: "2", name: "Thành phố Hồ Chí Minh", code: "HO", country: "Việt Nam", image: "null", priceRange: "null" },
  { id: "3", name: "Đà Nẵng", code: "DAD", country: "Việt Nam", image: "null", priceRange: "null" },
  { id: "4", name: "Nha Trang", code: "NHA", country: "Việt Nam", image: "null", priceRange: "null" },
  { id: "5", name: "Phú Quốc", code: "PQC", country: "Việt Nam", image: "null", priceRange: "null" },
  { id: "6", name: "Bangkok", code: "BKK", country: "Thái Lan", image: "null", priceRange: "null" },
  { id: "7", name: "Chiang Mai", code: "CNX", country: "Thái Lan", image: "null", priceRange: "null" },
  { id: "8", name: "Phuket", code: "HKT", country: "Thái Lan", image: "null", priceRange: "null" },
  { id: "9", name: "Singapore", code: "SIN", country: "Singapore", image: "null", priceRange: "null" },
  { id: "10", name: "Kuala Lumpur", code: "KUL", country: "Malaysia", image: "null", priceRange: "null" },
  { id: "11", name: "Jakarta", code: "CGK", country: "Indonesia", image: "null", priceRange: "null" },
  { id: "12", name: "Bali", code: "DPS", country: "Indonesia", image: "null", priceRange: "null" },
  { id: "13", name: "Phnom Penh", code: "PNH", country: "Campuchia", image: "null", priceRange: "null" },
  { id: "14", name: "Vientiane", code: "VTE", country: "Lào", image: "null", priceRange: "null" },
  { id: "15", name: "Hong Kong", code: "HKG", country: "Hong Kong", image: "null", priceRange: "null" },
];

export const searchCities = (query: string): City[] => {
  if (!query.trim()) return CITIES_DATA;

  const lowerQuery = query.toLowerCase();
  return CITIES_DATA.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.code.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  );
};
