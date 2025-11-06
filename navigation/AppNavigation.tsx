import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SearchFlightScreen from "../screens/SearchFlightScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import PassengerInfoScreen from "../screens/PassengerInfoScreen";
import ReturnFlightSelectionScreen from "../screens/ReturnFlightSelectionScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import QRCodeScreen from "../screens/QRCodeScreen";
import PaymentInfoScreen from "../screens/PaymentInfoScreen";
import FlightLookupScreen from "../screens/FlightLookupScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// kept ProfileScreen for reference; primary tab uses FlightLookupScreen now
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Profile Screen</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PassengerInfo" component={PassengerInfoScreen} />
    <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
  </Stack.Navigator>
);

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === "Home") iconName = "home-outline";
        else if (route.name === "BookFlight") iconName = "airplane-outline";
        else iconName = "person-outline";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: "Trang chủ" }} />
    <Tab.Screen
      name="BookFlight"
      component={SearchFlightScreen}
      options={{
        tabBarLabel: "Đặt vé",
        tabBarStyle: { display: "none" },
      }}
    />
    <Tab.Screen name="Profile" component={FlightLookupScreen} options={{ tabBarLabel: "Tra cứu" }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      <Stack.Screen name="ReturnFlightSelection" component={ReturnFlightSelectionScreen} />
      <Stack.Screen name="BookingConfirmation" component={require('../screens/BookingConfirmation').default} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
