import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <View>
      <StatusBar style="auto" />
      <AppNavigator />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
