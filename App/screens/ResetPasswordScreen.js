import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { useSelector } from "react-redux";
import { resetPasswordAccount } from "../API/firebase";

const ResetPasswordScreen = (props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState();

  // Show alert when error occurs
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK" }]);
    }
  }, [error]);

  // Load language from the redux store
  const language = useSelector((state) => state.language.language);

  const resetPasswordEmail = async () => {
    setError(null);
    if (!email) {
      setError("Email field is required");
    } else {
      try {
        await resetPasswordAccount(email, language);
        setEmail("");
      } catch (err) {
        console.log(err.message);
        setEmail("");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundSquare}></View>
      <View style={styles.backgroundTriangle}></View>
      <View
        style={{
          alignItems: "center",
          marginBottom: "auto",
          marginTop: 22 + Config.deviceHeight * 0.08,
        }}
      >
        <TextInput
          style={styles.input}
          autoCompleteType="email"
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="done"
          textContentType="emailAddress"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <View style={{ width: "70%", marginTop: Config.deviceHeight * 0.005 }}>
          <Text
            style={{
              fontFamily: "noto-sans-jp-bold",
              fontSize: 2 + Config.deviceWidth * 0.035,
              color: "white",
            }}
          >
            Reset link will be send to you by mail if your email address is
            known by us.
          </Text>
        </View>
        <TouchableOpacity onPress={resetPasswordEmail} style={styles.button}>
          <Text style={styles.text}>Reset</Text>
        </TouchableOpacity>
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
    height: Config.deviceHeight * 0.47,
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
    top: Config.deviceHeight * 0.47,
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
    marginTop: Config.deviceHeight * 0.02,
  },
  text: {
    fontFamily: "noto-sans-jp-bold",
    color: "white",
    fontSize: Config.deviceWidth * 0.07,
  },
});

export default ResetPasswordScreen;
