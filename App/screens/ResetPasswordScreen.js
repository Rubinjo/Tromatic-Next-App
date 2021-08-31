import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";

const ResetPasswordScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundSquare}></View>
      <View style={styles.backgroundTriangle}></View>
      <TextInput
        style={styles.input}
        autoCompleteType="email"
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="done"
        textContentType="emailAddress"
      />
      <Text>
        Reset link will be send to you by mail if your email address is known by
        us.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

export const stackOptions = (navData) => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundSquare: {
    width: Config.deviceWidth,
    height: Config.deviceHeight * 0.3,
    backgroundColor: Colors.PrimaryColor,
    position: "absolute",
    top: 0,
  },
  backgroundTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 90,
    borderRightWidth: Config.deviceWidth * 0.3,
    borderBottomWidth: 0,
    borderLeftWidth: Config.deviceWidth * 0.7,
    borderTopColor: Colors.PrimaryColor,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    top: Config.deviceHeight * 0.3,
  },
  input: {
    width: Config.deviceWidth * 0.8,
    backgroundColor: "white",
    borderColor: "darkgray",
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: Config.deviceWidth * 0.04,
    paddingVertical: Config.deviceHeight * 0.01,
    fontSize: Config.deviceWidth * 0.05,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginTop: 6 + Config.deviceHeight * 0.02,
  },
  button: {
    backgroundColor: Colors.SecondaryColor,
    borderRadius: 32,
    paddingHorizontal: Config.deviceWidth * 0.2,
  },
  text: {
    fontFamily: "noto-sans-jp-bold",
    color: "white",
    fontSize: Config.deviceWidth * 0.07,
  },
});

export default ResetPasswordScreen;
