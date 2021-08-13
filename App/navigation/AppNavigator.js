import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ConnectScreen from "../screens/ConnectScreen";
import DetailsScreen from "../screens/DetailsScreen";
import OverviewScreen, {
  tabOptions as overviewTabOptions,
} from "../screens/OverviewScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
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
  headerStyle: { backgroundColor: Colors.PrimaryColor },
  headerTitle: "",
};
const defaultTabOptions = {
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "white",
  tabBarStyle: { backgroundColor: Colors.PrimaryColor },
  headerStyle: { backgroundColor: Colors.PrimaryColor },
  headerTitle: "",
};

const LoginStack = createStackNavigator();
const OverviewStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const OverviewStackNav = (props) => {
  return (
    <OverviewStack.Navigator screenOptions={defaultStackOptions}>
      <OverviewStack.Screen name="Overview" component={OverviewScreen} />
      <OverviewStack.Screen name="Details" component={DetailsScreen} />
    </OverviewStack.Navigator>
  );
};

// Create userSigned in variable that triggers different navigation stack
// Below is simple dummy for testing
const userSignedIn = false;

const AppNavigator = (props) => {
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
          />
        </LoginStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
