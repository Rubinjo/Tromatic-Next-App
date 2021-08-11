import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  NavigationContainer,
  CommonActions,
  useNavigation,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../assets/constants/colors";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";

import { CHAMBERS } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";

const OverviewScreen = (props) => {
  const navigation = useNavigation();
  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        onSelect={() => {
          props.navigation.navigate("Details", {
            itemId: itemData.item.id,
            otherParam: "anything you want here",
          });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={CHAMBERS}
        renderItem={renderGridItem}
      />
      <View style={{ padding: 10 }}>
        <Text>Overview of chambers</Text>
      </View>
      {/* <Button
        title="Go to details"
        onPress={() => navigation.navigate("Details")}
      /> */}
    </View>
  );
};

export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => {
      let iconName;
      iconName = props.focused ? "engine" : "engine-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={34} color={"white"} />
      );
    },
    tabBarLabel: "Overview",
    headerShown: false,
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
