import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import Config from "../assets/config";
import Colors from "../assets/constants/colors";

const SignInScreen = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "English", value: "english" },
    { label: "German", value: "german" },
    { label: "Dutch", value: "dutch" },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundSquare}></View>
      <View style={styles.backgroundTriangle}></View>
      <Text>Welcome</Text>
      <TextInput placeholder="Email" keyboardType="email-address" />
      <TextInput placeholder="Password" />
      <TouchableOpacity>
        <Text>Sign in</Text>
      </TouchableOpacity>
      <Text>Forgot your password?</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <Text>Don't have an account?</Text>
      <TouchableOpacity>
        <Text>SIGN UP</Text>
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
    height: Config.deviceHeight * 0.7,
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
    top: Config.deviceHeight * 0.7,
  },
});

export default SignInScreen;
