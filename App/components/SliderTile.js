import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";

import { Slider } from "@miblanchard/react-native-slider";

const SliderTile = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <View style={styles.selectorTextContainer}>
          <Text
            style={[
              styles.text,
              { marginBottom: -Config.deviceHeight * 0.008 },
            ]}
          >
            {props.title}
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            maximumValue={props.stepCount[props.stepCount.length - 1]}
            step={1}
            value={props.value}
            onValueChange={(value) => props.onChange(value)}
            minimumTrackTintColor={Colors.PrimaryColor}
            maximumTrackTintColor={Colors.SecondaryColor}
          />
        </View>
        <View style={styles.sliderTextContainer}>
          {props.stepCount.map((item, index) => {
            return (
              <Text
                key={index}
                style={[
                  styles.text,
                  item == props.value
                    ? styles.sliderSelectedText
                    : {
                        fontSize: Config.deviceHeight * 0.018,
                      },
                ]}
              >
                {item}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  selectorContainer: {
    height: Config.deviceHeight * 0.13,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "grey",
    alignItems: "center",
  },
  selectorTextContainer: {
    flex: 1,
    marginTop: -Config.deviceHeight * 0.01,
    marginBottom: "auto",
    marginRight: "auto",
    marginLeft: Config.deviceWidth * 0.012,
  },
  sliderContainer: {
    flex: 1,
    width: "90%",
    alignItems: "stretch",
  },
  track: {
    height: Config.deviceHeight * 0.015,
    borderRadius: 6,
  },
  thumb: {
    borderWidth: 1.5,
    backgroundColor: "white",
  },
  text: {
    fontFamily: "noto-sans-jp-regular",
    fontSize: Config.deviceHeight * 0.022,
    color: "black",
  },
  sliderTextContainer: {
    flex: 1,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "auto",
    marginTop: -Config.deviceHeight * 0.01,
  },
  sliderSelectedText: {
    fontFamily: "noto-sans-jp-bold",
    fontSize: Config.deviceHeight * 0.02,
  },
});

export default SliderTile;
