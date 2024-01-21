import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { AuthContextProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { store, persistor } from "./store/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
			} catch (error) {
				console.warn(error);
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
					<AuthContextProvider>
						<StatusBar style="auto" />
						<AppNavigator />
					</AuthContextProvider>
				</View>
			</PersistGate>
		</Provider>
	);
}
