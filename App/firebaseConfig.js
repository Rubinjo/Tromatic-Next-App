import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const app = initializeApp({
    apiKey: Constants.expoConfig.extra.APIKEY,
    authDomain: Constants.expoConfig.extra.AUTHDOMAIN,
    databaseURL: Constants.expoConfig.extra.DATABASEURL,
    projectId: Constants.expoConfig.extra.PROJECTID,
    storageBucket: Constants.expoConfig.extra.STORAGEBUCKET,
    messagingSenderId:
        Constants.expoConfig.extra.MESSAGINGSENDERID,
    appId: Constants.expoConfig.extra.APPID,
});

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const firebase = getDatabase(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, "europe-west1");
