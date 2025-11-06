// types.ts
import type { FlightResult } from "../apis/flightService";
import type { Airport } from "./index";

export interface PassengerData {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface ContactData {
  email: string;
  phone: string;
}

export type RootStackParamList = {
  PassengerInfo: {
    flight?: FlightResult; // For oneWay
    outboundFlight?: FlightResult; // For roundTrip
    returnFlight?: FlightResult; // For roundTrip
    fromAirport: Airport;
    toAirport: Airport;
    departDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "oneWay" | "roundTrip";
  };
  PaymentInfo: {
    flight?: FlightResult;
    outboundFlight?: FlightResult;
    returnFlight?: FlightResult;
    fromAirport?: Airport;
    toAirport?: Airport;
    departDate?: string;
    returnDate?: string;
    // For one-way flow we send a PassengerData[]; for other flows it may differ
    passengers?: PassengerData[] | number;
    contact?: ContactData;
    selectedSeatClassId?: string;
    selectedReturnSeatClassId?: string;
    tripType?: "oneWay" | "roundTrip";
  } | undefined; // allow undefined when navigated directly
  PaymentMethod: { bookingPayload?: any } | undefined;
  BookingConfirmation: { booking: any; segments?: any[] } | undefined;
  SearchFlight: undefined;
};
