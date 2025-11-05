import type { FlightResult } from "../apis/flightService";
import type { Airport } from "./index";

export type RootStackParamList = {
  MainTabs: undefined;
  SearchResult: {
    fromAirportId: string;
    toAirportId: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "oneWay" | "roundTrip";
  };
  PassengerInfo: {
    flight: FlightResult;
    fromAirport: Airport;
    toAirport: Airport;
    departDate: string;
    passengers: number;
    tripType: "oneWay" | "roundTrip";
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
