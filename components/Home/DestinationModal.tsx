import React from "react";
import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Promotion } from "./PromotionCarousel";

interface PromotionModalProps {
  visible: boolean;
  promotion: Promotion | null;
  onClose: () => void;
  onBuyTicket?: (airportId: string) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ visible, promotion, onClose, onBuyTicket }) => {
  if (!promotion) return null;

  const handleBuyTicket = () => {
    if (onBuyTicket && promotion.id) {
      onBuyTicket(promotion.id);
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: promotion.image }} style={styles.modalImage} />

            <View style={styles.modalInfo}>
              <Text style={styles.modalTitle}>{promotion.title}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Booking period</Text>
                <Text style={styles.infoValue}>{promotion.bookingPeriod}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Travel period</Text>
                <Text style={styles.infoValue}>{promotion.travelPeriod}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fare type</Text>
                <Text style={styles.infoValue}>{promotion.fareType}</Text>
              </View>

              <Text style={styles.priceAmount}>{promotion.price}</Text>
              <Text style={styles.priceNote}>Include taxes, fees</Text>

              <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
                <Text style={styles.buyButtonText}>Buy Ticket</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#666",
    fontSize: 14,
  },
  infoValue: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff9900",
    marginTop: 8,
  },
  priceNote: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: "#ff9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PromotionModal;
