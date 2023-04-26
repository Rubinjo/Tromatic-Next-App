import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import DetailsScreen from "../screens/DetailsScreen";
import OverviewScreen, {
	tabOptions as overviewTabOptions,
} from "../screens/OverviewScreen";
import GraphScreen from "../screens/GraphScreen";
import GraphSelectorScreen from "../screens/GraphSelectorScreen";
import ResetConfirmScreen, {
	stackOptions as resetConfirmStackOptions,
} from "../screens/ResetConfirmScreen";
import ResetPasswordScreen, {
	stackOptions as resetPasswordStackOptions,
} from "../screens/ResetPasswordScreen";
import SettingsScreen, {
	tabOptions as settingsTabOptions,
} from "../screens/SettingsScreen";
import SignInScreen, {
	stackOptions as signInStackOptions,
} from "../screens/SignInScreen";
import SignUpScreen, {
	stackOptions as signUpStackOptions,
} from "../screens/SignUpScreen";

import Colors from "../assets/constants/colors";

const defaultStackOptions = {
	headerStyle: { backgroundColor: Colors.Primary },
	headerTitle: "",
	headerTitleAlign: "center",
	headerTintColor: Colors.SecondaryLight,
};
const defaultTabOptions = {
	headerStyle: { backgroundColor: Colors.Primary },
	headerTitle: "",
	tabBarStyle: { backgroundColor: Colors.Primary + "4d", elevation: 0 }, // opacity of 0.3, remove hidden shadow
};

const LoginStack = createStackNavigator();
const OverviewStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const OverviewStackNav = (props) => {
	return (
		<OverviewStack.Navigator screenOptions={defaultStackOptions}>
			<OverviewStack.Screen name="Overview" component={OverviewScreen} />
			<OverviewStack.Screen name="Details" component={DetailsScreen} />
			<OverviewStack.Screen name="Graph" component={GraphScreen} />
			<OverviewStack.Screen
				name="GraphSelector"
				component={GraphSelectorScreen}
			/>
		</OverviewStack.Navigator>
	);
};

const AppNavigator = (props) => {
	// Create userSigned in variable that triggers different navigation stack
	const [userSignedIn, setUserSignedIn] = useState(false);
	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserSignedIn(true);
			} else {
				setUserSignedIn(false);
			}
		});
	});

	return (
		<NavigationContainer>
			{userSignedIn ? (
				<Tab.Navigator screenOptions={defaultTabOptions}>
					<Tab.Screen
						name="OverviewStack"
						component={OverviewStackNav}
						options={overviewTabOptions}
					/>
					<Tab.Screen
						name="Settings"
						component={SettingsScreen}
						options={settingsTabOptions}
					/>
				</Tab.Navigator>
			) : (
				<LoginStack.Navigator>
					<LoginStack.Screen
						name="SignIn"
						component={SignInScreen}
						options={signInStackOptions}
					/>
					<LoginStack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={signUpStackOptions}
					/>
					<LoginStack.Screen
						name="ResetPassword"
						component={ResetPasswordScreen}
						options={resetPasswordStackOptions}
					/>
					<LoginStack.Screen
						name="ResetConfirm"
						component={ResetConfirmScreen}
						options={resetConfirmStackOptions}
					/>
				</LoginStack.Navigator>
			)}
		</NavigationContainer>
	);
};

export default AppNavigator;
