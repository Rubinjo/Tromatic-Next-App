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
import i18n from "../utils/i18n";

const SignUpScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundSquare}></View>
      <View style={styles.backgroundTriangle}></View>
      <View>
        <Text style={[styles.headText, { fontSize: Config.deviceWidth * 0.1 }]}>
          {i18n.t("signup.signup")}
        </Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("signup.companyid")}
          returnKeyType="next"
          blurOnSubmit={false}
          // onSubmitEditing={() => {
          //   this.nameInput.focus();
          // }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("signup.name")}
          autoCompleteType="name"
          textContentType="name"
          returnKeyType="next"
          blurOnSubmit={false}
          // ref={(input) => {
          //   this.nameInput = input;
          // }}
          // onSubmitEditing={() => {
          //   this.emailInput.focus();
          // }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("signup.email")}
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          blurOnSubmit={false}
          // ref={(input) => {
          //   this.emailInput = input;
          // }}
          // onSubmitEditing={() => {
          //   this.passwordInput.focus();
          // }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("signup.password")}
          textContentType="newPassword"
          returnKeyType="next"
          blurOnSubmit={false}
          // ref={(input) => {
          //   this.passwordInput = input;
          // }}
          // onSubmitEditing={() => {
          //   this.confirmPasswordInput.focus();
          // }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("signup.confirm")}
          textContentType="newPassword"
          returnKeyType="done"
          // ref={(input) => {
          //   this.confirmPasswordInput = input;
          // }}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text
          style={[styles.headText, { fontSize: Config.deviceWidth * 0.07 }]}
        >
          {i18n.t("signup.signup")}
        </Text>
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
    height: Config.deviceHeight * 0.85,
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
    top: Config.deviceHeight * 0.85,
  },
  headText: {
    fontFamily: "noto-sans-jp-bold",
    color: "white",
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
});

export default SignUpScreen;
