import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import { initSettings, fetchSettings, insertLanguage } from "./database/sqlite";
import AppNavigator from "./navigation/AppNavigator";
import machineReducer from "./store/reducers/machine";
import userReducer from "./store/reducers/user";
import languageReducer from "./store/reducers/language";

// Fetch custom font-family
const fetchFonts = async () => {
  return Font.loadAsync({
    "noto-sans-jp-regular": require("./assets/fonts/NotoSansJP-Regular.otf"),
    "noto-sans-jp-bold": require("./assets/fonts/NotoSansJP-Bold.otf"),
  });
};

const rootReducer = combineReducers({
  machine: machineReducer,
  user: userReducer,
  language: languageReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  // const [savedLanguage, setSavedLanguage] = useState([]);

  // Initialize SQLite database
  // async function initData() {
  //   try {
  //     await initSettings();
  //   } catch (err) {
  //     console.log("Initializing database failed.");
  //     console.log(err);
  //   }
  // }

  // Fetch data from sqlite database
  // Save into context with the help of the useState savedShots
  // async function fetchData() {
  //   try {
  //     let fetch = await fetchSettings();
  //     let dataFetch = fetch.rows._array;
  //     if (!dataFetch.length) {
  //       await insertLanguage("English");
  //       fetch = await fetchSettings();
  //       dataFetch = status.rows._array;
  //     }
  //     setSavedLanguage(dataFetch[0].language);
  //     console.log("Data fetched from database");
  //   } catch (error) {
  //     console.log("Fetching data from database failed");
  //     console.log(error);
  //   }
  // }

  // Execute database loading
  // useEffect(() => {
  //   async function loadDatabase() {
  //     await initData();
  //     await fetchData();
  //   }
  //   loadDatabase();
  // }, []);

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
      <StatusBar style="auto" />
      <AppNavigator />
    </Provider>
  );
}
