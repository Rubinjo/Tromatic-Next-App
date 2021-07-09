import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ConnectScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>ConnectScreen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ConnectScreen;
