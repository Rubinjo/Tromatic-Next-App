import "dotenv/config";

const apiKey = process.env.APIKEY;
const authDomain = process.env.AUTHDOMAIN;
const databaseURL = process.env.DATABASEURL;
const projectId = process.env.PROJECTID;
const storageBucket = process.env.STORAGEBUCKET;
const messagingSenderId = process.env.MESSAGINGSENDERID;
const appId = process.env.APPID;
const googleServiceFile = process.env.GOOGLE_SERVICES_JSON;

export default {
	name: "Tromatic NEXT",
	slug: "Tromatic-NEXT",
	...(process.env.EXPO_OWNER ? { owner: process.env.EXPO_OWNER } : {}),
	currentFullName: "tromatic-next",
	version: "1.0.20",
	platforms: ["ios", "android"],
	orientation: "portrait",
	primaryColor: "#0F7BCA",
	icon: "./assets/icon.png",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#0F7BCA",
	},
	...(process.env.EXPO_UPDATE_URL
		? { updates: {
			fallbackToCacheTimeout: 0,
			url: process.env.EXPO_UPDATE_URL,
		} }
		: {}),
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
		buildNumber: "1.0.20",
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
		versionCode: 21,
	},
	plugins: ["expo-localization"],
	extra: {
		APIKEY: apiKey,
		AUTHDOMAIN: authDomain,
		DATABASEURL: databaseURL,
		PROJECTID: projectId,
		STORAGEBUCKET: storageBucket,
		MESSAGINGSENDERID: messagingSenderId,
		APPID: appId,
		...(process.env.EAS_PROJECT_ID
			? { eas: { projectId: process.env.EAS_PROJECT_ID } }
			: {}),
	},
};
