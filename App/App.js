import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import { initSettings, fetchSettings, insertLanguage } from "./database/sqlite";
import AppNavigator from "./navigation/AppNavigator";
import machineReducer from "./store/reducers/machine";
import userReducer from "./store/reducers/user";

const rootReducer = combineReducers({
  machine: machineReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export default function App() {
  const [savedLanguage, setSavedLanguage] = useState([]);

  // Initialize SQLite database
  async function initData() {
    try {
      await initSettings();
    } catch (err) {
      console.log("Initializing database failed.");
      console.log(err);
    }
  }

  // Fetch data from sqlite database
  // Save into context with the help of the useState savedShots
  async function fetchData() {
    try {
      let fetch = await fetchSettings();
      let dataFetch = fetch.rows._array;
      if (!dataFetch.length) {
        await insertLanguage("English");
        fetch = await fetchSettings();
        dataFetch = status.rows._array;
      }
      setSavedLanguage(dataFetch[0].language);
      console.log("Data fetched from database");
    } catch (error) {
      console.log("Fetching data from database failed");
      console.log(error);
    }
  }

  // Execute database loading
  useEffect(() => {
    async function loadDatabase() {
      await initData();
      await fetchData();
    }
    loadDatabase();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppNavigator />
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
