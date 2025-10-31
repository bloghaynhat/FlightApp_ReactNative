import type React from "react";
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import type { City } from "../../types/City";
import { searchCities } from "../../data/cities";

interface CitySearchDropdownProps {
  visible: boolean;
  onSelect: (city: City) => void;
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
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  useEffect(() => {
    setFilteredCities(searchCities(query));
  }, [query]);

  const handleCitySelect = (city: City) => {
    onSelect(city);
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chọn thành phố</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thành phố..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.cityItem} onPress={() => handleCitySelect(item)}>
              <View>
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.cityCountry}>{item.country}</Text>
              </View>
              <Text style={styles.cityCode}>{item.code}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy thành phố</Text>}
        />
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
});
