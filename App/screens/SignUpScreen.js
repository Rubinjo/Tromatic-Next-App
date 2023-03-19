import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import { registration } from "../auth/firebase";

const SignUpScreen = (props) => {
  const [companyID, setCompanyID] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Show alert when error occurs
  useEffect(() => {
    if (error) {
      Alert.alert(i18n.t("authentication.error.title"), error, [{ text: "OK" }]);

    }
  }, [error]);

  // Register user
  // uses Firebase Auth
  const signUp = async () => {
    setError(null);
    if (!companyID) {
      setError(i18n.t("authentication.error.companyId"));
    } else if (!fullName) {
      setError(i18n.t("authentication.error.name"));
    } else if (!email) {
      setError(i18n.t("authentication.error.email"));
    } else if (!password) {
      setError(i18n.t("authentication.error.password"));
    } else if (!confirmPassword) {
      setPassword("");
      setError(i18n.t("authentication.error.passwordConfirm"));
    } else if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setError(i18n.t("authentication.error.passwordMatch"));
    } else {
      setIsLoading(true);
      try {
        await registration(companyID, fullName, email, password);
      } catch (err) {
        console.log(err.message);
        setIsLoading(false);
        setError(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundSquare}></View>
      <View style={styles.backgroundTriangle}></View>
      <View
        style={{
          marginBottom: "auto",
          marginTop: 20 + Config.deviceHeight * 0.06,
        }}
      >
        <Text style={[styles.headText, { fontSize: Config.deviceWidth * 0.1 }]}>
          {i18n.t("authentication.signUp")}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("authentication.companyId")}
          returnKeyType="next"
          blurOnSubmit={false}
          // onSubmitEditing={() => {
          //   this.nameInput.focus();
          // }}
          value={companyID}
          onChangeText={(id) => {
            setCompanyID(id);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("authentication.name")}
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
          value={fullName}
          onChangeText={(name) => {
            setFullName(name);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("authentication.email")}
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
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("authentication.password")}
          textContentType="newPassword"
          returnKeyType="next"
          blurOnSubmit={false}
          // ref={(input) => {
          //   this.passwordInput = input;
          // }}
          // onSubmitEditing={() => {
          //   this.confirmPasswordInput.focus();
          // }}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("authentication.confirm")}
          textContentType="newPassword"
          returnKeyType="done"
          // ref={(input) => {
          //   this.confirmPasswordInput = input;
          // }}
          value={confirmPassword}
          onChangeText={(password2) => setConfirmPassword(password2)}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text
              style={[styles.headText, { fontSize: Config.deviceWidth * 0.07 }]}
            >
              {i18n.t("authentication.signUp")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    height: Config.deviceHeight * 0.9,
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
    top: Config.deviceHeight * 0.9,
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
    marginTop: 6 + Config.deviceHeight * 0.03,
  },
  button: {
    backgroundColor: Colors.SecondaryColor,
    borderRadius: 32,
    paddingHorizontal: Config.deviceWidth * 0.2,
    marginTop: 6 + Config.deviceHeight * 0.04,
  },
});

export default SignUpScreen;
