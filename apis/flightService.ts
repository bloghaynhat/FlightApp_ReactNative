import apiClient from "./apiClient";
import type { Airline, Flight, SeatClass } from "../types";
export interface FlightSearchParams {
  fromAirportId: string;
  toAirportId: string;
  departureDate: string; // YYYY-MM-DD format
  returnDate?: string; // Optional for one-way
  passengers: number;
}

export interface FlightResult extends Flight {
  airline?: Airline;
  seatClasses?: SeatClass[];
}

export const flightService = {
  /**
   * Tìm kiếm chuyến bay một chiều
   * @param params - Thông tin tìm kiếm
   * @returns Danh sách chuyến bay phù hợp
   */
  searchFlights: async (params: FlightSearchParams): Promise<FlightResult[]> => {
    try {
      // Lấy tất cả dữ liệu cần thiết song song
      const [flightsResponse, airlinesResponse, seatClassesResponse] = await Promise.all([
        apiClient.get<Flight[]>("/flights"),
        apiClient.get<Airline[]>("/airlines"),
        apiClient.get<SeatClass[]>("/seatClasses"),
      ]);

      const flights = flightsResponse.data;
      const airlines = airlinesResponse.data;
      const seatClasses = seatClassesResponse.data;

      // Lọc flights theo điều kiện tìm kiếm
      const filteredFlights = flights.filter((flight) => {
        // Lấy phần ngày từ departureTime (bỏ phần giờ)
        const flightDate = new Date(flight.departureTime).toISOString().split("T")[0];

        return (
          flight.fromAirportId === params.fromAirportId &&
          flight.toAirportId === params.toAirportId &&
          flightDate === params.departureDate &&
          flight.status === "Scheduled"
        );
      });

      // Kết hợp dữ liệu airline và seatClasses cho mỗi chuyến bay
      const results: FlightResult[] = filteredFlights.map((flight) => ({
        ...flight,
        airline: airlines.find((airline) => airline.id === flight.airlineId),
        seatClasses: seatClasses.filter((seatClass) => seatClass.flightId === flight.id),
      }));

      // Sắp xếp theo giờ khởi hành
      results.sort((a, b) => {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      });

      return results;
    } catch (error) {
      console.error("Error searching flights:", error);
      throw new Error("Không thể tìm kiếm chuyến bay. Vui lòng thử lại.");
    }
  },

  /**
   * Tìm kiếm chuyến bay khứ hồi
   * @param params - Thông tin tìm kiếm bao gồm ngày về
   * @returns Object chứa danh sách chuyến đi và chuyến về
   */
  searchRoundTripFlights: async (
    params: FlightSearchParams
  ): Promise<{ outbound: FlightResult[]; inbound: FlightResult[] }> => {
    try {
      if (!params.returnDate) {
        throw new Error("Ngày về là bắt buộc cho chuyến bay khứ hồi");
      }

      // Tìm chuyến đi (outbound)
      const outboundFlights = await flightService.searchFlights({
        fromAirportId: params.fromAirportId,
        toAirportId: params.toAirportId,
        departureDate: params.departureDate,
        passengers: params.passengers,
      });

      // Tìm chuyến về (inbound) - đổi ngược from và to
      const inboundFlights = await flightService.searchFlights({
        fromAirportId: params.toAirportId,
        toAirportId: params.fromAirportId,
        departureDate: params.returnDate,
        passengers: params.passengers,
      });

      return {
        outbound: outboundFlights,
        inbound: inboundFlights,
      };
    } catch (error) {
      console.error("Error searching round trip flights:", error);
      throw new Error("Không thể tìm kiếm chuyến bay khứ hồi. Vui lòng thử lại.");
    }
  },

  /**
   * Lấy chi tiết một chuyến bay theo ID
   * @param id - ID của chuyến bay
   * @returns Thông tin chi tiết chuyến bay
   */
  getFlightById: async (id: string): Promise<FlightResult | null> => {
    try {
      const [flightResponse, airlinesResponse, seatClassesResponse] = await Promise.all([
        apiClient.get<Flight>(`/flights/${id}`),
        apiClient.get<Airline[]>("/airlines"),
        apiClient.get<SeatClass[]>("/seatClasses"),
      ]);

      const flight = flightResponse.data;
      const airlines = airlinesResponse.data;
      const seatClasses = seatClassesResponse.data;

      return {
        ...flight,
        airline: airlines.find((airline) => airline.id === flight.airlineId),
        seatClasses: seatClasses.filter((seatClass) => seatClass.flightId === flight.id),
      };
    } catch (error) {
      console.error(`Error fetching flight ${id}:`, error);
      return null;
    }
  },

  /**
   * Lấy tất cả airlines
   * @returns Danh sách hãng bay
   */
  getAllAirlines: async (): Promise<Airline[]> => {
    try {
      const response = await apiClient.get<Airline[]>("/airlines");
      return response.data;
    } catch (error) {
      console.error("Error fetching airlines:", error);
      throw new Error("Không thể tải danh sách hãng bay");
    }
  },

  /**
   * Lấy tất cả seat classes của một chuyến bay
   * @param flightId - ID của chuyến bay
   * @returns Danh sách hạng vé
   */
  getSeatClassesByFlightId: async (flightId: string): Promise<SeatClass[]> => {
    try {
      const response = await apiClient.get<SeatClass[]>("/seatClasses");
      return response.data.filter((seatClass) => seatClass.flightId === flightId);
    } catch (error) {
      console.error(`Error fetching seat classes for flight ${flightId}:`, error);
      throw new Error("Không thể tải thông tin hạng vé");
    }
  },
};
