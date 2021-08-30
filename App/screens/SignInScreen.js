import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import * as languageActions from "../store/actions/language";
import i18n from "../utils/i18n";
import { signIn } from "../API/firebase";

const SignInScreen = (props) => {
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "English",
      value: "en",
      icon: () => (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../assets/united-kingdom.png")}
            style={[styles.icon, { marginRight: Config.deviceWidth * 0.005 }]}
          />
          <Image
            source={require("../assets/united-states-of-america.png")}
            style={styles.icon}
          />
        </View>
      ),
    },
    {
      label: "Deutsch",
      value: "de",
      icon: () => (
        <Image source={require("../assets/germany.png")} style={styles.icon} />
      ),
    },
    {
      label: "Nederlands",
      value: "nl",
      icon: () => (
        <Image
          source={require("../assets/netherlands.png")}
          style={styles.icon}
        />
      ),
    },
  ]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Update language setting when redux store is loaded
  useEffect(() => {
    setValue(language);
  }, [language]);

  const language = useSelector((state) => state.language.language);

  const dispatch = useDispatch();

  const signIn = () => {
    if (!email) {
      Alert.alert("Email field is required.");
    }

    if (!password) {
      Alert.alert("Password field is required.");
    }
    signIn(email, password);
    setEmail("");
    setPassword("");
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
          {i18n.t("signin.welcome")}
        </Text>
      </View>
      <View
        style={{
          marginBottom: Config.deviceWidth * 0.1,
        }}
      >
        <TextInput
          style={styles.input}
          autoCompleteType="email"
          placeholder={i18n.t("signin.email")}
          keyboardType="email-address"
          returnKeyType="next"
          // onSubmitEditing={() => {
          //   this.passwordInput.focus();
          // }}
          blurOnSubmit={false}
          textContentType="emailAddress"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.input}
          autoCompleteType="password"
          placeholder={i18n.t("signin.password")}
          returnKeyType="done"
          // ref={(input) => {
          //   this.passwordInput = input;
          // }}
          textContentType="password"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text
          style={[styles.headText, { fontSize: Config.deviceWidth * 0.07 }]}
        >
          {i18n.t("signin.signin")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("ResetPassword");
        }}
      >
        <Text style={styles.headText}>{i18n.t("signin.forgot")}</Text>
      </TouchableOpacity>
      <DropDownPicker
        style={{
          width: Config.deviceWidth * 0.5,
          alignSelf: "center",
          borderColor: "darkgrey",
        }}
        dropDownContainerStyle={{
          width: Config.deviceWidth * 0.5,
          alignSelf: "center",
          borderColor: "darkgrey",
        }}
        dropDownDirection="BOTTOM"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => {
          i18n.locale = value;
          try {
            dispatch(languageActions.updateLanguage(value));
          } catch (err) {
            console.log(err);
            setError(err.message);
          }
        }}
      />
      <View style={{ flexDirection: "row", marginTop: "auto" }}>
        <Text style={styles.text}>{i18n.t("signin.account")}</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SignUp");
          }}
        >
          <Text style={[styles.headText, { color: Colors.PrimaryColor }]}>
            {i18n.t("signin.signup")}
          </Text>
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
  headText: {
    fontFamily: "noto-sans-jp-bold",
    color: "white",
  },
  text: {
    fontFamily: "noto-sans-jp-regular",
    color: "darkgrey",
    marginRight: 6,
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
  icon: {
    width: 25,
    height: 25,
  },
});

export default SignInScreen;
