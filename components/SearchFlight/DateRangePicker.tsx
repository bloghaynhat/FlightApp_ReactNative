import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (start: Date | null, end: Date | null) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectingDepart, setSelectingDepart] = useState(true);
  const [selectedRange, setSelectedRange] = useState<{ start?: string; end?: string }>({
    start: startDate ? startDate.toISOString().split("T")[0] : undefined,
    end: endDate ? endDate.toISOString().split("T")[0] : undefined,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const onDayPress = (day: DateData) => {
    const { dateString } = day;
    let newRange = { ...selectedRange };

    if (selectingDepart) {
      // Nếu đang chọn ngày đi
      if (newRange.end && new Date(dateString) > new Date(newRange.end)) {
        // Nếu ngày đi mới lớn hơn ngày về hiện tại, xóa ngày về
        newRange = { start: dateString, end: undefined };
      } else {
        newRange.start = dateString;
      }
      setSelectingDepart(false); // Chuyển sang chọn ngày về
    } else {
      // Nếu đang chọn ngày về
      if (newRange.start && new Date(dateString) < new Date(newRange.start)) {
        // Nếu ngày về mới nhỏ hơn ngày đi, cập nhật cả hai
        newRange = { start: dateString, end: newRange.start };
      } else {
        newRange.end = dateString;
      }
    }
    setSelectedRange(newRange);
  };

  const handleConfirm = (range = selectedRange) => {
    const start = range.start ? new Date(range.start) : null;
    const end = range.end ? new Date(range.end) : null;
    onSelect(start, end);
    setVisible(false);
    setSelectingDepart(true); // Reset về chọn ngày đi cho lần sau
  };

  const openPicker = (isDepart: boolean) => {
    setSelectingDepart(isDepart);
    setVisible(true);
  };

  const markedDates: Record<string, any> = {};
  if (selectedRange.start) {
    markedDates[selectedRange.start] = {
      startingDay: true,
      color: "#00adf5",
      textColor: "#fff",
    };
  }
  if (selectedRange.end) {
    markedDates[selectedRange.end] = {
      endingDay: true,
      color: "#00adf5",
      textColor: "#fff",
    };

    // Đánh dấu các ngày ở giữa
    if (selectedRange.start) {
      let current = new Date(selectedRange.start);
      const end = new Date(selectedRange.end);
      while (current < end) {
        const date = current.toISOString().split("T")[0];
        if (date !== selectedRange.start && date !== selectedRange.end) {
          markedDates[date] = { color: "#a7e3ff", textColor: "#000" };
        }
        current.setDate(current.getDate() + 1);
      }
    }
  }

  return (
    <View>
      <View style={styles.dateInputsContainer}>
        {/* Ô chọn ngày đi */}
        <TouchableOpacity
          style={[styles.dateInput, styles.dateInputLeft]}
          onPress={() => openPicker(true)}
        >
          <View>
            <Text style={styles.dateLabel}>Ngày đi</Text>
            <Text style={styles.dateValue}>
              {selectedRange.start ? formatDate(selectedRange.start) : "Chọn ngày"}
            </Text>
          </View>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        {/* Ô chọn ngày về */}
        <TouchableOpacity
          style={[styles.dateInput, styles.dateInputRight]}
          onPress={() => openPicker(false)}
        >
          <View>
            <Text style={styles.dateLabel}>Ngày về</Text>
            <Text style={styles.dateValue}>
              {selectedRange.end ? formatDate(selectedRange.end) : "Chọn ngày"}
            </Text>
          </View>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectingDepart ? "Chọn ngày đi" : "Chọn ngày về"}
            </Text>
          </View>
          <Calendar
            markingType="period"
            markedDates={markedDates}
            onDayPress={onDayPress}
            minDate={new Date().toISOString().split("T")[0]}
            monthFormat={'MM/yyyy'}
            hideExtraDays={true}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setVisible(false)} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleConfirm()}
              style={[styles.button, styles.confirm]}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateInputsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dateInput: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInputLeft: {
    borderRightWidth: 0,
  },
  dateInputRight: {
    borderLeftWidth: 0,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
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
