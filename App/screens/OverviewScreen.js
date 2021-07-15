import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  NavigationContainer,
  CommonActions,
  useNavigation,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../assets/constants/colors";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";

const OverviewScreen = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>OverviewScreen!</Text>
      <Button
        title="Go to details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

// Hij is wit dus je ziet hem momenteel niet
export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => (
      <MaterialCommunityIcons
        name="engine"
        size={props.size}
        color={Colors.PrimaryColor}
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OverviewScreen;
