import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const OverviewScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>OverviewScreen!</Text>
    </View>
  );
};

// Hij is wit dus je ziet hem momenteel niet
export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => (
      <MaterialCommunityIcons name="engine" size={props.size} color="white" />
    ),
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

export default OverviewScreen;
