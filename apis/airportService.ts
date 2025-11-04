import apiClient from "./apiClient";
import type { Airport } from "../types/City";

export const airportService = {
  // Lấy tất cả airports
  getAllAirports: async (): Promise<Airport[]> => {
    try {
      const response = await apiClient.get<Airport[]>("/airports");
      return response.data;
    } catch (error) {
      console.error("Error fetching airports:", error);
      throw error;
    }
  },

  // Tìm kiếm airports theo từ khóa
  searchAirports: async (query: string): Promise<Airport[]> => {
    try {
      const airports = await airportService.getAllAirports();
      if (!query) return airports;

      const lowerQuery = query.toLowerCase();
      return airports.filter(
        (airport) =>
          airport.name.toLowerCase().includes(lowerQuery) ||
          airport.code.toLowerCase().includes(lowerQuery) ||
          airport.city.toLowerCase().includes(lowerQuery) ||
          airport.country.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching airports:", error);
      throw error;
    }
  },

  // Lấy airport theo ID
  getAirportById: async (id: string): Promise<Airport | null> => {
    try {
      const response = await apiClient.get<Airport>(`/airports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching airport ${id}:`, error);
      return null;
    }
  },
};
