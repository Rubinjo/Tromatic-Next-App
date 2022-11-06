import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistGate } from "redux-persist/integration/react";
import { initializeApp } from "firebase/app";

import AppNavigator from "./navigation/AppNavigator";
import machineReducer from "./store/reducers/machine";
import userReducer from "./store/reducers/user";
import languageReducer from "./store/reducers/language";
import graphReducer from "./store/reducers/graph";
import apiKeys from "./assets/config/keys";

// Fetch custom font-family
const fetchFonts = async () => {
  return Font.loadAsync({
    "noto-sans-jp-regular": require("./assets/fonts/NotoSansJP-Regular.otf"),
    "noto-sans-jp-bold": require("./assets/fonts/NotoSansJP-Bold.otf"),
  });
};

// Create root reducer
const rootReducer = combineReducers({
  machine: machineReducer,
  user: userReducer,
  language: languageReducer,
  graph: graphReducer,
});

// Redux persist settings
// Persist the language & graph store
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["language", "graph"],
};

// Apply Redux Persist settings to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with Redux Thunk middleware and persistant reducer
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await fetchFonts();
        console.log("Loaded fonts");

        initializeApp(apiKeys.firebaseConfig);
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
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="auto" />
          <AppNavigator />
        </PersistGate>
      </Provider>
    </View>
  );
}
