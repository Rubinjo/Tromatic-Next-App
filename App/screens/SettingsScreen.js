import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import Colors from "../assets/constants/colors";
import Config from "../utils/config";
import { signOutAccount } from "../auth/firebase";
import { updateLanguage } from "../store/slices/language";
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
            source={require("../assets/flags/united-kingdom.png")}
            style={[styles.icon, { marginRight: Config.deviceWidth * 0.005 }]}
          />
          <Image
            source={require("../assets/flags/united-states-of-america.png")}
            style={styles.icon}
          />
        </View>
      ),
    },
    {
      label: "Deutsch",
      value: "de",
      icon: () => (
        <Image
          source={require("../assets/flags/germany.png")}
          style={styles.icon}
        />
      ),
    },
    {
      label: "Nederlands",
      value: "nl",
      icon: () => (
        <Image
          source={require("../assets/flags/netherlands.png")}
          style={styles.icon}
        />
      ),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Update language setting when redux store is loaded
  useEffect(() => {
    setValue(language);
    i18n.locale = language;
  }, [language]);

  // Show alert when error occurs
  useEffect(() => {
    if (error) {
      Alert.alert(i18n.t("general.error"), error, [{ text: i18n.t("general.okAllCaps") }]);
    }
  }, [error]);

  // Load language from the redux store
  const language = useSelector((state) => state.language.language);

  const dispatch = useDispatch();

  // Logout user
  // uses Firebase Auth
  const signOutUser = () => {
    Alert.alert(
      i18n.t("authentication.signOutWarningTitle"),
      i18n.t("authentication.signOutWarning"),
      [
        {
          text: i18n.t("general.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: i18n.t("general.okAllCaps"),
          onPress: async () => {
            setError(null);
            setIsLoading(true);
            try {
              await signOutAccount();
            } catch (err) {
              setIsLoading(false);
              setError(i18n.t("general.retry"));
            }
          },
        },
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
              dispatch(updateLanguage(value));
            } catch (err) {
              console.log(err);
              setError(err.message);
            }
          }}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.SecondaryColor} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={signOutUser}>
          <Text style={styles.headText}>Sign out</Text>
        </TouchableOpacity>
      )}
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
