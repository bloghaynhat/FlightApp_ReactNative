import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (dateString: string) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, onClose, onDateSelect }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Select Date of Birth</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <Calendar
            onDayPress={(day) => onDateSelect(day.dateString)}
            maxDate={new Date().toISOString().split("T")[0]}
            minDate="1900-01-01"
            monthFormat={"MM/yyyy"}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#0066cc",
              selectedDayBackgroundColor: "#0066cc",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#0066cc",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#0066cc",
              selectedDotColor: "#ffffff",
              arrowColor: "#0066cc",
              monthTextColor: "#0066cc",
              indicatorColor: "#0066cc",
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  calendar: {
    borderRadius: 0,
  },
});

export default DatePickerModal;
