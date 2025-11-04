export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  image: string;
}
export interface Flight {
  id: string;
  flightNumber: string;
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  logo: string;
}

export interface SeatClass {
  id: string;
  flightId: string;
  className: string;
  price: number;
  totalSeats: number;
}
