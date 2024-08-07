import "dotenv/config";

const apiKey = process.env.APIKEY;
const authDomain = process.env.AUTHDOMAIN;
const databaseURL = process.env.DATABASEURL;
const projectId = process.env.PROJECTID;
const storageBucket = process.env.STROAGEBUCKET;
const messagingSenderId = process.env.MESSAGINGSENDERID;
const appId = process.env.APPID;
const googleServiceFile = process.env.GOOGLE_SERVICES_JSON;

export default {
    name: "Tromatic NEXT",
    slug: "Tromatic-NEXT",
    owner: "your-expo-owner",
    currentFullName: "tromatic-next",
    version: "1.0.19",
    platforms: ["ios", "android"],
    orientation: "portrait",
    primaryColor: "#0F7BCA",
    icon: "./assets/icon.png",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#0F7BCA",
    },
    updates: {
        fallbackToCacheTimeout: 0,
        url: "https://u.expo.dev/00000000-0000-4000-8000-000000000000",
    },
    runtimeVersion: {
        policy: "sdkVersion",
    },
    assetBundlePatterns: ["**/*"],
    notification: {
        icon: "./assets/notification-icon.png",
        color: "#0F7BCA",
        iosDisplayInForeground: true,
    },
    ios: {
        supportsTablet: true,
        buildNumber: "1.0.19",
        bundleIdentifier: "nl.bes-bollmann.tromatic-next",
    },
    android: {
        package: "nl.bes_bollmann.tromatic_next",
        googleServicesFile: googleServiceFile,
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#0F7BCA",
        },
        softwareKeyboardLayoutMode: "pan",
        versionCode: 20,
    },
    plugins: ["expo-localization"],
    extra: {
        APIKEY: apiKey,
        AUTHDOMAIN: authDomain,
        DATABASEURL: databaseURL,
        PROJECTID: projectId,
        STROAGEBUCKET: storageBucket,
        MESSAGINGSENDERID: messagingSenderId,
        APPID: appId,
        eas: {
            projectId: "00000000-0000-4000-8000-000000000000",
        },
    },
};
