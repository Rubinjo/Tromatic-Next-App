import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  NavigationContainer,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LineChart from "../components/Chart";
import { CHAMBERS } from "../data/dummy-data";

const DetailsScreen = (props) => {
  // const navigation = useNavigation();
  const route = useRoute();
  const { itemId, otherParam } = route.params;
  // const { chamberId } = props.route.params;
  // const selectedChamber = CHAMBERS.find((chamId) => chamId.id === chamberId);
  return (
    <View style={styles.container}>
      <Text>DetailsScreen!</Text>
      {/* <Text>{selectedChamber.title}</Text> */}
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <View>
        <LineChart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DetailsScreen;
