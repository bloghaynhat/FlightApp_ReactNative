import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { airportService } from "../apis/airportService";
import { flightService } from "../apis/flightService";
import HomeHeader from "../components/Home/HomeHeader";
import PromotionCarousel, { Promotion } from "../components/Home/PromotionCarousel";
import DestinationSection from "../components/Home/DestinationSection";
import PromotionModal from "../components/Home/DestinationModal";
import type { CityWithPrice } from "../components/Home/DestinationCard";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [cities, setCities] = useState<CityWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const promotions: Promotion[] = [
    {
      id: "1",
      title: "Fly Early or Late – Save Big, Don't Wait!",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
      bookingPeriod: "01/01/2025-31/12/2025",
      travelPeriod: "01/01/2025-31/12/2025",
      fareType: "Economy Lite",
      price: "1,227,000 VND",
    },
    {
      id: "2",
      title: "Discount 5% ticket prices for Lotusmiles members",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
      bookingPeriod: "01/01/2025-31/12/2025",
      travelPeriod: "01/01/2025-31/12/2025",
      fareType: "Economy Lite",
      price: "1,227,000 VND",
    },
  ];

  useEffect(() => {
    loadCitiesWithPrices();
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  const loadCitiesWithPrices = async () => {
    try {
      setLoading(true);
      const airports = await airportService.getAllAirports();

      const citiesWithPrices = await Promise.all(
        airports.slice(0, 6).map(async (airport) => {
          try {
            const flights = await flightService.searchFlights({
              fromAirportId: "SGN",
              toAirportId: airport.id,
              departureDate: "2025-12-10",
              passengers: 1,
            });

            let minPrice = 1227000;
            if (flights.length > 0) {
              const prices = flights.flatMap((flight) => flight.seatClasses?.map((sc) => sc.price) || []);
              if (prices.length > 0) {
                minPrice = Math.min(...prices);
              }
            }

            return { ...airport, minPrice };
          } catch {
            return { ...airport, minPrice: 1227000 };
          }
        })
      );

      setCities(citiesWithPrices);
    } catch (error) {
      console.error("Error loading cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityPress = (city: CityWithPrice) => {
    const promotion: Promotion = {
      id: city.id,
      title: `Great fare to ${city.city}, Vietnam`,
      image: city.image,
      bookingPeriod: "01/01/2025-31/12/2025",
      travelPeriod: "01/01/2025-31/12/2025",
      fareType: "Economy Lite",
      price: formatPrice(city.minPrice || 1227000),
      city: city.city,
    };
    setSelectedPromotion(promotion);
    setModalVisible(true);
  };

  const handleBuyTicket = async (airportId: string) => {
    try {
      const airport = await airportService.getAirportById(airportId);
      // Navigate to BookFlight tab with pre-selected destination
      navigation.navigate("MainTabs", {
        screen: "BookFlight",
        params: {
          screen: "SearchFlight",
          params: {
            preSelectedDestination: airport,
          },
        },
      });
      // Close modal after navigation
      setModalVisible(false);
    } catch (error) {
      console.error("Error loading airport:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader />

        <PromotionCarousel promotions={promotions} />

        <DestinationSection cities={cities} loading={loading} onCityPress={handleCityPress} formatPrice={formatPrice} />
      </ScrollView>

      <PromotionModal
        visible={modalVisible}
        promotion={selectedPromotion}
        onClose={() => setModalVisible(false)}
        onBuyTicket={handleBuyTicket}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginHorizontal: 16,
    marginTop: 24,
  },
  bottomDescription: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 20,
  },
});

export default HomeScreen;
