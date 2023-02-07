import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import { View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { initializeApp } from "firebase/app";

import AppNavigator from "./navigation/AppNavigator";
import { store, persistor } from "./store/store";

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

        initializeApp({
          apiKey: Constants.expoConfig.extra.apiKey,
          authDomain: Constants.expoConfig.extra.authDomain,
          databaseURL: Constants.expoConfig.extra.databaseURL,
          projectId: Constants.expoConfig.extra.projectId,
          storageBucket: Constants.expoConfig.extra.storageBucket,
          messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
          appId: Constants.expoConfig.extra.appId,
        });
        console.log("Connected with Firebase");
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
