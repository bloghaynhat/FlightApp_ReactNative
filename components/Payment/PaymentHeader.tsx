import React from "react"
import { View, Text, StyleSheet, ImageBackground } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface PaymentHeaderProps {
    title: string
    currentStep: number
    totalSteps: number
}

const STEP_ICONS: Array<React.ComponentProps<typeof MaterialCommunityIcons>["name"]> = [
    "airplane-takeoff",
    "seat-individual-suite",
    "wallet",
    "check-circle",
]

/**
 * Payment header component with background image and premium design
 */
const PaymentHeader = ({ title, currentStep, totalSteps }: PaymentHeaderProps): React.ReactElement => {
    const insets = useSafeAreaInsets()

    return (
        <ImageBackground
            source={require("../../assets/background-payment-header.png")}
            style={styles.header}
            imageStyle={styles.backgroundImage}
        >
            <View style={styles.headerContent}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.stepCounter}>
                    Bước {currentStep}/{totalSteps}
                </Text>
            </View>

            <View style={styles.progressContainer}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
                        index < currentStep ? "check-circle" : STEP_ICONS[index]

                    return (
                        <React.Fragment key={index}>
                            <View
                                style={[
                                    styles.stepIcon,
                                    index < currentStep && styles.stepIconCompleted,
                                    index === currentStep && styles.stepIconCurrent,
                                    index > currentStep && styles.stepIconPending,
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={index < currentStep ? 20 : 24}
                                    color={
                                        index < currentStep ? "#ffffff" : index === currentStep ? "#ffffff" : "rgba(255, 255, 255, 0.6)"
                                    }
                                />
                            </View>

                            {/* Connecting Line Between Steps */}
                            {index < totalSteps - 1 && (
                                <View
                                    style={[
                                        styles.connectorLine,
                                        index < currentStep - 1 && styles.connectorLineCompleted,
                                        index >= currentStep - 1 && styles.connectorLinePending,
                                    ]}
                                />
                            )}
                        </React.Fragment>
                    )
                })}
            </View>

            <View style={styles.progressBarContainer}>
                <LinearGradient
                    colors={["#a78bfa", "#60a5fa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]}
                />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: "hidden",
    },
    backgroundImage: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    overlay: {
        flex: 1,
        paddingVertical: 28,
        paddingHorizontal: 16,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContent: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: 8,
        letterSpacing: -0.5,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    stepCounter: {
        fontSize: 14,
        fontWeight: "700",
        color: "rgba(255, 255, 255, 0.95)",
        letterSpacing: 0.3,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    stepIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2.5,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.4)",
    },
    stepIconCompleted: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderColor: "#ffffff",
        borderWidth: 2,
    },
    stepIconCurrent: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderColor: "#ffffff",
        borderWidth: 3,
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    stepIconPending: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(255, 255, 255, 0.25)",
    },
    connectorLine: {
        height: 3,
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 1.5,
    },
    connectorLineCompleted: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    connectorLinePending: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
        shadowColor: "rgba(124, 58, 237, 0.5)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    progressBar: {
        height: "100%",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
})

export default PaymentHeader
