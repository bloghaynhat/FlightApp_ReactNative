export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  image: string;
}

export interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onSelect: (airport: Airport) => void;
  iconName: string;
}
