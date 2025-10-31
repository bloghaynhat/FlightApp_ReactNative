import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { City } from "../types/City";

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: city.image }} style={styles.image} />
      <Text style={styles.name}>{city.name}</Text>
      <Text style={styles.price}>{city.priceRange}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 15,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontWeight: "bold",
    marginTop: 8,
  },
  price: {
    color: "#777",
    fontSize: 12,
  },
});

export default CityCard;
