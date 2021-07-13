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
import SettingsScreen from "../screens/SettingsScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

import COLORS from "../assets/constants/colors";

// Krijg de kleuren enzo nog niet helemaal werkent
// en krijg dat de juiste headers showen nog niet goed (momenteel heb je een header van de stack en van de tab navigators)

const defaultStackOptions = {
  headerStyle: {
    backgroundColor: COLORS.PrimaryColor,
  },
  title: "",
  headerTintColor: "white",
};
const defaultTabOptions = {
  showLabel: false,
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
const userSignedIn = true;

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
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      ) : (
        <LoginStack.Navigator>
          <LoginStack.Screen name="SignIn" component={SignInScreen} />
          <LoginStack.Screen name="SignUp" component={SignUpScreen} />
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
