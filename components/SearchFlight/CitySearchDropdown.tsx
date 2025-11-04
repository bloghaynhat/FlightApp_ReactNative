import React from "react";
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import type { Airport } from "../../types/City";
import { airportService } from "../../apis/airportService";

interface CitySearchDropdownProps {
  visible: boolean;
  onSelect: (city: Airport) => void;
  onClose: () => void;
  initialQuery?: string;
}

export const CitySearchDropdown: React.FC<CitySearchDropdownProps> = ({
  visible,
  onSelect,
  onClose,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filteredCities, setFilteredCities] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách airports khi mở modal
  useEffect(() => {
    if (visible) {
      loadAirports();
    }
  }, [visible]);

  // Tìm kiếm khi query thay đổi
  useEffect(() => {
    if (visible) {
      searchAirports(query);
    }
  }, [query, visible]);

  const loadAirports = async () => {
    try {
      setLoading(true);
      setError(null);
      const airports = await airportService.getAllAirports();
      setFilteredCities(airports);
    } catch (err) {
      setError("Không thể tải danh sách sân bay");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchAirports = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const airports = await airportService.searchAirports(searchQuery);
      setFilteredCities(airports);
    } catch (err) {
      setError("Lỗi khi tìm kiếm");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: Airport) => {
    onSelect(city);
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chọn sân bay</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sân bay..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadAirports} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cityItem} onPress={() => handleCitySelect(item)}>
                <View>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityCountry}>
                    {item.city} - {item.country}
                  </Text>
                </View>
                <Text style={styles.cityCode}>{item.code}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy sân bay</Text>}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    color: "#000",
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  cityCountry: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  cityCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066cc",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
