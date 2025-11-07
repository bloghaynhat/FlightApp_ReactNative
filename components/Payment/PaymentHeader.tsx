import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface PaymentHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onClosePress?: () => void;
}

const STEP_ICONS: Array<React.ComponentProps<typeof MaterialCommunityIcons>["name"]> = [
  "airplane-takeoff",
  "seat-passenger",
  "wallet",
  "receipt",
];

/**
 * Payment header component with background image and premium design
 */
const PaymentHeader = ({
  title,
  currentStep,
  totalSteps,
  showBackButton = true,
  onBackPress,
  onClosePress,
}: PaymentHeaderProps): React.ReactElement => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleClosePress = () => {
    if (onClosePress) {
      onClosePress();
    } else {
      // Navigate to Home tab
      (navigation as any).navigate("MainTabs", {
        screen: "Home",
      });
    }
  };

  return (
    <View style={styles.header}>
      {/* Back Button and Title Row */}
      <View style={styles.topRow}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
          <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const iconName = STEP_ICONS[index];

          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.stepIcon,
                  isCompleted && styles.stepIconCompleted,
                  isCurrent && styles.stepIconCurrent,
                  !isCompleted && !isCurrent && styles.stepIconPending,
                ]}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={18}
                  color={isCompleted || isCurrent ? "#0070BB" : "rgba(255, 255, 255, 0.6)"}
                />
              </View>

              {/* Connecting Line Between Steps */}
              {index < totalSteps - 1 && (
                <View style={[styles.connectorLine, stepNumber < currentStep && styles.connectorLineCompleted]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#0070BB",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  stepIconCompleted: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#ffffff",
    borderWidth: 0,
  },
  stepIconCurrent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#ffffff",
    borderWidth: 0,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  stepIconPending: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  connectorLine: {
    height: 2,
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: -2,
  },
  connectorLineCompleted: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});

export default PaymentHeader;
