import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import Colors from "../assets/constants/colors";
import Config from "../utils/config";
import { loggingOut } from "../API/firebase";
import * as languageActions from "../store/actions/language";
import i18n from "../utils/i18n";

const SettingsScreen = (props) => {
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

  // Update language setting when redux store is loaded
  useEffect(() => {
    setValue(language);
  }, [language]);

  const language = useSelector((state) => state.language.language);

  const dispatch = useDispatch();

  const signOutUser = () => {
    Alert.alert(
      "Logout warning",
      "You will be logged out from your current account",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => loggingOut() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text>Language</Text>
        <DropDownPicker
          style={{
            width: Config.deviceWidth * 0.5,
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
      </View>
      <TouchableOpacity style={styles.button} onPress={signOutUser}>
        <Text style={styles.headText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => {
      let iconName;
      iconName = props.focused ? "cog" : "cog-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={34} color={"white"} />
      );
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headText: {
    fontFamily: "noto-sans-jp-bold",
    color: "white",
    fontSize: Config.deviceWidth * 0.06,
  },
  button: {
    backgroundColor: Colors.SecondaryColor,
    borderRadius: 32,
    paddingHorizontal: Config.deviceWidth * 0.1,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default SettingsScreen;
