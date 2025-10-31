import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (start: Date | null, end: Date | null) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start?: string; end?: string }>({
    start: startDate ? startDate.toISOString().split("T")[0] : undefined,
    end: endDate ? endDate.toISOString().split("T")[0] : undefined,
  });

  const onDayPress = (day: DateData) => {
    const { dateString } = day;
    let newRange = { ...selectedRange };

    if (!newRange.start || (newRange.start && newRange.end)) {
      newRange = { start: dateString, end: undefined };
    } else if (newRange.start && !newRange.end) {
      if (new Date(dateString) < new Date(newRange.start)) {
        newRange = { start: dateString, end: newRange.start };
      } else {
        newRange.end = dateString;
      }
    }
    setSelectedRange(newRange);
  };

  const handleConfirm = () => {
    const start = selectedRange.start ? new Date(selectedRange.start) : null;
    const end = selectedRange.end ? new Date(selectedRange.end) : null;
    onSelect(start, end);
    setVisible(false);
  };

  const markedDates: Record<string, any> = {};
  if (selectedRange.start) {
    markedDates[selectedRange.start] = { startingDay: true, color: "#00adf5", textColor: "#fff" };
  }
  if (selectedRange.end) {
    markedDates[selectedRange.end] = { endingDay: true, color: "#00adf5", textColor: "#fff" };

    let current = new Date(selectedRange.start!);
    const end = new Date(selectedRange.end);
    while (current < end) {
      const date = current.toISOString().split("T")[0];
      if (date !== selectedRange.start && date !== selectedRange.end) {
        markedDates[date] = { color: "#a7e3ff", textColor: "#000" };
      }
      current.setDate(current.getDate() + 1);
    }
  }

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={styles.inputText}>
          {selectedRange.start && selectedRange.end
            ? `${selectedRange.start} → ${selectedRange.end}`
            : "Chọn ngày đi và về"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Calendar markingType="period" markedDates={markedDates} onDayPress={onDayPress} />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setVisible(false)} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirm]}>
              <Text style={[styles.buttonText, { color: "#fff" }]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  inputText: {
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancel: {
    backgroundColor: "#eee",
  },
  confirm: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DateRangePicker;
