import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";

import Light from "./Light";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

const CategoryGridTile = (props) => {
  const [value, setValue] = useState(1);
  return (
    <View style={styles.gridItem}>
      <TouchableNativeFeedback style={{ flex: 1 }} onPress={props.onSelect}>
        <View style={{ ...styles.container, backgroundColor: props.color }}>
          <Light color={props.color} />
          <Text>{props.title}</Text>
          <View style={styles.sliderContainer}>
            <Slider
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              maximumValue={100}
              step={1}
              value={value}
              onValueChange={(value) => setValue(value)}
              // disabled={true}
              minimumTrackTintColor={Colors.SecondaryColor}
            />
          </View>
          <Text>Time left: {value}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    width: 300,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    width: Config.deviceWidth * 0.7,
    alignItems: "stretch",
    justifyContent: "center",
  },
  track: {
    height: Config.deviceWidth * 0.05,
    borderRadius: 6,
    backgroundColor: Colors.PrimaryColor,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  thumb: {
    opacity: 0,
  },
});

export default CategoryGridTile;
