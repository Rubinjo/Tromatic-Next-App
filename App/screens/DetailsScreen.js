import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

// import {
//   NavigationContainer,
//   useRoute,
//   useNavigation,
// } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack"; Uninstalled at this moment

// import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

import SliderTile from "../components/SliderTile";

const DetailsScreen = (props) => {
  const [valve, setValve] = useState(1);

  const onValveChange = (value) => {
    setValve(value);
  };

  // const navigation = useNavigation();
  // const route = useRoute();
  // const { itemId, otherParam } = route.params;
  // const { chamberId } = props.route.params;
  // const selectedChamber = CHAMBERS.find((chamId) => chamId.id === chamberId);
  return (
    <View style={styles.container}>
      {/* <Text>{selectedChamber.title}</Text> */}
      {/* <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text> */}
      <SliderTile
        title="Valves"
        stepCount={[...Array(5).keys()]} // Array of steps (step length you want ++)
        value={valve}
        onChange={onValveChange}
      />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Graph");
        }}
      >
        <Text>See Graph</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default DetailsScreen;
