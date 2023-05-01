import "dotenv/config";

const apiKey = process.env.APIKEY;
const authDomain = process.env.AUTHDOMAIN;
const databaseURL = process.env.DATABASEURL;
const projectId = process.env.PROJECTID;
const storageBucket = process.env.STROAGEBUCKET;
const messagingSenderId = process.env.MESSAGINGSENDERID;
const appId = process.env.APPID;

export default {
	name: "Tromatic NEXT",
	slug: "Tromatic-NEXT",
	version: "1.0.0",
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
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
	},
	android: {
		package: "nl.bes_bollmann.tromatic_next",
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#FFFFFF",
		},
		softwareKeyboardLayoutMode: "pan",
	},
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
