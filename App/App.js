import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistGate } from "redux-persist/integration/react";
import * as firebase from "firebase";

import AppNavigator from "./navigation/AppNavigator";
import machineReducer from "./store/reducers/machine";
import userReducer from "./store/reducers/user";
import languageReducer from "./store/reducers/language";
import apiKeys from "./assets/config/keys";

// Ignore timer warning
// Caused by UseEffect to check for user login (in AppNavigator.js)
// Currently no alternative solution offered by Expo
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

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
});

// Redux persist settings
// Persist the language store
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["language"],
};

// Apply Redux Persist settings to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with Redux Thunk middleware and persistant reducer
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  // Initialize firebase app if not already active
  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  // Keep splash screen active untill fonts are fully loaded
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="auto" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
