import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export interface Promotion {
  id: string;
  title: string;
  image: string;
  bookingPeriod: string;
  travelPeriod: string;
  fareType: string;
  price: string;
  city?: string;
}

interface PromotionCarouselProps {
  promotions: Promotion[];
}

const PromotionCarousel: React.FC<PromotionCarouselProps> = ({ promotions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.promotionScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {promotions.map((promo) => (
          <TouchableOpacity key={promo.id}>
            <View style={styles.promotionCard}>
              <Image source={{ uri: promo.image }} style={styles.promotionImage} />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.promotionGradient}>
                <Text style={styles.promotionTitle}>{promo.title}</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {promotions.map((_, index) => (
          <View key={index} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promotionScroll: {
    // marginTop: 4,
  },
  promotionCard: {
    width: width,
    height: 220,
    borderRadius: 0,
    overflow: "hidden",
  },
  promotionImage: {
    width: "100%",
    height: "100%",
  },
  promotionGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: "flex-end",
  },
  promotionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  detailsText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 4,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#ff9900",
    width: 24,
  },
});

export default PromotionCarousel;
