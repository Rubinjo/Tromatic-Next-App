import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from 'expo-font';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

import AppNavigator from "./navigation/AppNavigator";
import { store, persistor } from "./store/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Fetch custom font-family
const fetchFonts = async () => {
  return Font.loadAsync({
    "noto-sans-jp-regular": require("./assets/fonts/NotoSansJP-Regular.otf"),
    "noto-sans-jp-bold": require("./assets/fonts/NotoSansJP-Bold.otf"),
  });
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await fetchFonts();
        console.log("Loaded fonts");

        const app = initializeApp({
          apiKey: Constants.expoConfig.extra.APIKEY,
          authDomain: Constants.expoConfig.extra.AUTHDOMAIN,
          databaseURL: Constants.expoConfig.extra.DATABASEURL,
          projectId: Constants.expoConfig.extra.PROJECTID,
          storageBucket: Constants.expoConfig.extra.STORAGEBUCKET,
          messagingSenderId: Constants.expoConfig.extra.MESSAGINGSENDERID,
          appId: Constants.expoConfig.extra.APPID,
        });
        initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log("Connected with Firebase");

        // Initialize local notification
        // Notifications.setNotificationHandler({
        //   handleNotification: async () => ({
        //     shouldShowAlert: true,
        //     shouldPlaySound: true,
        //     shouldSetBadge: true,
        //   }),
        // });
        // console.log("Initialized notification service")
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <StatusBar style="auto" />
          <AppNavigator />
        </View>
      </PersistGate>
    </Provider>
  );
}
