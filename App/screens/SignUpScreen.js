import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SignUpScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>SignUpScreen!</Text>
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

export default SignUpScreen;
