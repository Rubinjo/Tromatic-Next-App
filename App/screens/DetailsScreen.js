import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  NavigationContainer,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { Slider } from "@miblanchard/react-native-slider";
// import { createNativeStackNavigator } from "@react-navigation/native-stack"; Uninstalled at this moment

import LineChart from "../components/Chart";
import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

const DetailsScreen = (props) => {
  const [value, setValue] = useState(1);
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
      <View style={styles.sliderContainer}>
        <Slider
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          maximumValue={5}
          step={1}
          value={value}
          onValueChange={(value) => setValue(value)}
          minimumTrackTintColor={Colors.PrimaryColor}
          maximumTrackTintColor={Colors.SecondaryColor}
        />
      </View>
      <Text>Time left: {value}</Text>
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
  sliderContainer: {
    width: Config.deviceWidth * 0.9,
    alignItems: "stretch",
    justifyContent: "center",
  },
  track: {
    height: Config.deviceHeight * 0.015,
    borderRadius: 6,
  },
  thumb: {
    borderWidth: 1.5,
    backgroundColor: "white",
  },
});

export default DetailsScreen;
