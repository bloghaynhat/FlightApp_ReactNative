import React from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import Header from "../components/Header";
import SectionHeader from "../components/SectionHeader";
import CityCard from "../components/CityCard";
import { bestCities } from "../data/cities";

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Header />

      <SectionHeader title="The best cities for you" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {bestCities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </ScrollView>

      <SectionHeader title="Explore Destinations" />
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
        }}
        style={styles.destinationImage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  destinationImage: {
    width: "90%",
    height: 160,
    borderRadius: 12,
    alignSelf: "center",
    marginVertical: 15,
  },
});

export default HomeScreen;
