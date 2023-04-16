import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
  Switch,
  SafeAreaView
} from "react-native";
import Constants from 'expo-constants';
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

import Colors from "../assets/constants/colors";
import Settings from "../assets/icons/Settings"
import Config from "../utils/config";
import { signOutAccount } from "../auth/firebase";
import { updateLanguage } from "../store/slices/language";
import i18n from "../utils/i18n";

const SettingsScreen = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [notification, setNotification] = useState(false);
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
  const [name, setName] = useState("Error");
  const [cid, setCid] = useState("Error");
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userRef = ref(db, "users/" + auth.currentUser.uid);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        user = snapshot.val()
        setName(user.fullName)
        setCid(user.cid)
      } else {
        setError("User not found")
      }
    }).catch((e) => {
      setError(e)
    });
  }, []);

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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "90%",
          flex: 1,
          justifyContent: "space-between",
          marginTop: Config.deviceHeight * 0.01,
          marginBottom: Config.deviceHeight * 0.03
        }}
      >
        <View>
          <Text style={{ fontFamily: "noto-sans-jp-regular", color: Colors.TextDark }}>Logged in as</Text>
          <View style={{ backgroundColor: Colors.TextLight, borderRadius: 9, flexDirection: "row" }}>
            <View style={{ width: "50%", paddingVertical: Config.deviceWidth * 0.015, paddingLeft: Config.deviceWidth * 0.04 }}>
              <Text style={{ fontFamily: "noto-sans-jp-regular", marginBottom: -Config.deviceWidth * 0.04 }}>Full name</Text>
              <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Company ID</Text>
            </View>
            <View style={{ width: "50%", paddingVertical: Config.deviceWidth * 0.015 }}>
              <Text style={{ fontFamily: "noto-sans-jp-regular", marginBottom: -Config.deviceWidth * 0.04 }}>{name}</Text>
              <Text style={{ fontFamily: "noto-sans-jp-regular" }}>{cid}</Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.SecondaryColor} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={signOutUser}>
              <Text style={styles.headText}>Sign out</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ zIndex: 1 }}>
          <Text style={{ fontFamily: "noto-sans-jp-regular", color: Colors.TextDark }}>Language</Text>
          <DropDownPicker
            style={{
              borderColor: Colors.DetailsLight,
              borderRadius: 9,
              paddingHorizontal: Config.deviceWidth * 0.04,
              paddingVertical: Config.deviceWidth * 0.035,
            }}
            dropDownContainerStyle={{
              alignSelf: "center",
              borderColor: Colors.DetailsLight,
              borderRadius: 9,
              paddingHorizontal: Config.deviceWidth * 0.02,
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
        <View>
          <Text style={{ fontFamily: "noto-sans-jp-regular", color: Colors.TextDark }}>Notifications</Text>
          <View style={{ backgroundColor: Colors.TextLight, borderRadius: 9, paddingLeft: Config.deviceWidth * 0.04, paddingVertical: Config.deviceWidth * 0.01 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Notifications</Text>
              <Switch style={{ marginLeft: "auto", marginRight: Config.deviceWidth * 0.04 }} trackColor={{ false: Colors.DetailsLight, true: Colors.PrimaryForeground }} thumbColor={notification ? Colors.PrimaryForeground : Colors.DetailsLight} onValueChange={() => setNotification(prev => !prev)} value={notification} />
            </View>
          </View>
        </View>
        <View>
          <Text style={{ fontFamily: "noto-sans-jp-regular", color: Colors.TextDark }}>Information</Text>
          <View style={{ backgroundColor: Colors.TextLight, borderRadius: 9, paddingLeft: Config.deviceWidth * 0.04, paddingVertical: Config.deviceWidth * 0.01 }}>
            <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Version: {Constants.manifest.version}</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => {
      let iconColor;
      iconColor = props.focused ? Colors.PrimaryBackground : Colors.TextDarkest;
      return (
        <Settings color={iconColor} />
      );
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PrimaryBackground + "1a", // opacity of 0.1
    alignItems: "center",
    // justifyContent: "center",
  },
  headText: {
    fontFamily: "noto-sans-jp-bold",
    color: Colors.PrimaryForeground,
    fontSize: Config.deviceWidth * 0.038,
    textAlign: "center"
  },
  button: {
    // backgroundColor: Colors.SecondaryColor,
    marginTop: Config.deviceHeight * 0.02,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.PrimaryForeground,
    // paddingHorizontal: Config.deviceWidth * 0.1,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default SettingsScreen;
