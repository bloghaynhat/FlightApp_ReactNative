export interface City {
  id: string;
  name: string;
  image: string;
  priceRange: string;
  code: string;
  country: string;
}

export interface LocationInputProps {
  label: string;
  placeholder: string;
  value: City | null;
  onSelect: (city: City) => void;
}
