import React, { useState, useMemo, useCallback } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onSelect: (start: Date | null, end: Date | null) => void;
  mode?: "single" | "range"; // Thêm prop mode
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onSelect,
  mode = "range", // Mặc định là range
}) => {
  const [visible, setVisible] = useState(false);
  const [selectingDepart, setSelectingDepart] = useState(true);
  const [selectedRange, setSelectedRange] = useState<{ start?: string; end?: string }>({
    start: startDate ? startDate.toISOString().split("T")[0] : undefined,
    end: endDate ? endDate.toISOString().split("T")[0] : undefined,
  });

  // Memoize formatDate function
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }, []);

  // Memoize onDayPress để tránh tạo lại function mỗi lần render
  const onDayPress = useCallback(
    (day: DateData) => {
      const { dateString } = day;
      let newRange = { ...selectedRange };

      if (mode === "single") {
        // Chế độ chọn 1 ngày - chỉ cập nhật, không tự động xác nhận
        newRange.start = dateString;
        newRange.end = undefined;
        setSelectedRange(newRange);
        return;
      }

      // Chế độ chọn range (code cũ)
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
    },
    [mode, selectingDepart, selectedRange]
  );

  // Memoize handleConfirm
  const handleConfirm = useCallback(
    (range = selectedRange) => {
      const start = range.start ? new Date(range.start) : null;
      const end = range.end ? new Date(range.end) : null;
      onSelect(start, end);
      setVisible(false);
      setSelectingDepart(true); // Reset về chọn ngày đi cho lần sau
    },
    [selectedRange, onSelect]
  );

  // Memoize openPicker
  const openPicker = useCallback((isDepart: boolean) => {
    setSelectingDepart(isDepart);
    setVisible(true);
  }, []);

  // Memoize handleCancel
  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  // Memoize markedDates - chỉ tính toán lại khi selectedRange hoặc mode thay đổi
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    if (selectedRange.start) {
      marks[selectedRange.start] = {
        startingDay: mode === "range",
        selected: true,
        color: "#00adf5",
        textColor: "#fff",
      };
    }

    if (selectedRange.end) {
      marks[selectedRange.end] = {
        endingDay: mode === "range",
        selected: true,
        color: "#00adf5",
        textColor: "#fff",
      };

      // Đánh dấu các ngày ở giữa (chỉ khi mode = 'range')
      if (mode === "range" && selectedRange.start) {
        let current = new Date(selectedRange.start);
        const end = new Date(selectedRange.end);
        while (current < end) {
          const date = current.toISOString().split("T")[0];
          if (date !== selectedRange.start && date !== selectedRange.end) {
            marks[date] = { color: "#a7e3ff", textColor: "#000" };
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }

    return marks;
  }, [selectedRange.start, selectedRange.end, mode]);

  // Memoize minDate
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Memoize modal title
  const modalTitle = useMemo(() => {
    if (mode === "single") {
      return "Chọn ngày đi";
    }
    return selectingDepart ? "Chọn ngày đi" : "Chọn ngày về";
  }, [mode, selectingDepart]);

  // Memoize formatted dates
  const formattedStartDate = useMemo(
    () => (selectedRange.start ? formatDate(selectedRange.start) : "Chọn ngày"),
    [selectedRange.start, formatDate]
  );

  const formattedEndDate = useMemo(
    () => (selectedRange.end ? formatDate(selectedRange.end) : "Chọn ngày"),
    [selectedRange.end, formatDate]
  );

  return (
    <View>
      <View style={mode === "single" ? styles.dateInputsContainerSingle : styles.dateInputsContainer}>
        {/* Ô chọn ngày đi */}
        <TouchableOpacity
          style={[styles.dateInput, mode === "single" ? styles.dateInputFull : styles.dateInputLeft]}
          onPress={() => openPicker(true)}
        >
          <View>
            <Text style={styles.dateLabel}>Ngày đi</Text>
            <Text style={styles.dateValue}>{formattedStartDate}</Text>
          </View>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        {/* Ô chọn ngày về - chỉ hiện khi mode = "range" */}
        {mode === "range" && (
          <TouchableOpacity style={[styles.dateInput, styles.dateInputRight]} onPress={() => openPicker(false)}>
            <View>
              <Text style={styles.dateLabel}>Ngày về</Text>
              <Text style={styles.dateValue}>{formattedEndDate}</Text>
            </View>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
          </View>
          <Calendar
            markingType={mode === "range" ? "period" : undefined}
            markedDates={markedDates}
            onDayPress={onDayPress}
            minDate={minDate}
            monthFormat={"MM/yyyy"}
            hideExtraDays={true}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleConfirm()} style={[styles.button, styles.confirm]}>
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
  dateInputsContainerSingle: {
    flexDirection: "row",
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
  dateInputFull: {
    borderRightWidth: 0,
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
