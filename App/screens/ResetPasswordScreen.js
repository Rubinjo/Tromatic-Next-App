import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ResetPasswordScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>ResetPasswordScreen!</Text>
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

export default ResetPasswordScreen;
