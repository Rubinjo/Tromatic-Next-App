import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ConnectScreen from "../screens/ConnectScreen";
import DetailsScreen from "../screens/DetailsScreen";
import OverviewScreen from "../screens/OverviewScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const defaultTabOptions = {};

const Tab = createBottomTabNavigator();

const AppNavigator = (props) => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={defaultTabOptions}>
        <Tab.Screen name="Overview" component={OverviewScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
