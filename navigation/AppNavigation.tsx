import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Profile Screen</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const BookFlightStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchFlight" component={SearchFlightScreen} />
    <Stack.Screen name="SearchResult" component={SearchResultScreen} />
    <Stack.Screen name="ReturnFlightSelection" component={ReturnFlightSelectionScreen} />
    <Stack.Screen name="PassengerInfo" component={PassengerInfoScreen} />
    <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    <Stack.Screen name="BookingConfirmation" component={require("../screens/BookingConfirmation").default} />
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
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: "Trang chủ",
      }}
    />
    <Tab.Screen
      name="BookFlight"
      component={BookFlightStack}
      listeners={({ navigation, route }) => ({
        tabPress: (e) => {
          const state = navigation.getState();
          const bookFlightRoute = state.routes.find((r: any) => r.name === "BookFlight");

          // Check if BookFlight stack exists and has nested routes
          if (bookFlightRoute?.state?.routes && bookFlightRoute.state.index !== undefined) {
            const currentRoute = bookFlightRoute.state.routes[bookFlightRoute.state.index];

            // If not on SearchFlight, reset to SearchFlight
            if (currentRoute.name !== "SearchFlight") {
              e.preventDefault();
              (navigation as any).navigate("BookFlight", {
                screen: "SearchFlight",
              });
            }
          }
        },
      })}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "SearchFlight";
        // Ẩn tab bar cho tất cả các màn hình trong booking flow
        const hideTabScreens = [
          "SearchFlight",
          "SearchResult",
          "ReturnFlightSelection",
          "PassengerInfo",
          "PaymentInfo",
          "PaymentMethod",
          "BookingConfirmation",
        ];

        return {
          tabBarLabel: "Đặt vé",
          tabBarStyle: hideTabScreens.includes(routeName) ? { display: "none" } : undefined,
        };
      }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Tài khoản" }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
