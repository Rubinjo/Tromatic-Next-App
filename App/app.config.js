import "dotenv/config";

const apiKey = process.env.APIKEY
const authDomain = process.env.AUTHDOMAIN
const databaseURL = process.env.DATABASEURL
const projectId = process.env.PROJECTID
const storageBucket = process.env.STROAGEBUCKET
const messagingSenderId = process.env.MESSAGINGSENDERID
const appId = process.env.APPID

export default {
  name: "DryChamber",
  slug: "DryChamber",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    "fallbackToCacheTimeout": 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    package: "nl.bes_bollmann.tromatic",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    }
  },
  extra: {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    eas: {
      projectId: "00000000-0000-4000-8000-000000000000"
    }
  }
}
