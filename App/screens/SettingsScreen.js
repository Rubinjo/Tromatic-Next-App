import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SettingsScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>SettingsScreen!</Text>
    </View>
  );
};

export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => {
      let iconName;
      iconName = props.focused ? "cog" : "cog-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={34} color={"white"} />
      );
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SettingsScreen;
