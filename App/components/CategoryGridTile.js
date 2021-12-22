import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
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
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "auto",
              marginRight: "auto",
              marginTop: 1 + Config.deviceHeight * 0.005,
              marginLeft: 1 + Config.deviceWidth * 0.08,
            }}
          >
            <Light color={props.color} />
            <View style={{ marginLeft: 1 + Config.deviceWidth * 0.02 }}>
              <Text
                style={{
                  fontFamily: "noto-sans-jp-bold",
                  fontSize: 5 + Config.deviceHeight * 0.02,
                  color: "black",
                }}
              >
                {props.title}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: "auto",
              marginTop: Config.deviceHeight * 0.01,
            }}
          >
            <View style={styles.sliderContainer}>
              <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={(value) => setValue(value)}
                // disabled={true}
                minimumTrackTintColor={Colors.PrimaryColor}
                maximumTrackTintColor={Colors.SecondaryColor}
              />
            </View>
            <View
              style={{
                marginLeft: "auto",
                marginRight: 4 + Config.deviceWidth * 0.02,
                marginTop: -1 - Config.deviceHeight * 0.02,
              }}
            >
              <Text
                style={{
                  fontFamily: "noto-sans-jp-regular",
                  color: "black",
                }}
              >
                Time left: {value}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: 5 + Config.deviceHeight * 0.04,
                  width: 5 + Config.deviceHeight * 0.04,
                  resizeMode: "contain",
                }}
                source={require("../assets/icons/humidity.png")}
              />
              <Text>60%</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: 5 + Config.deviceHeight * 0.04,
                  width: 5 + Config.deviceHeight * 0.04,
                  resizeMode: "contain",
                }}
                source={require("../assets/icons/humidity.png")}
              />
              <Text>60%</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: 5 + Config.deviceHeight * 0.04,
                  width: 5 + Config.deviceHeight * 0.04,
                  resizeMode: "contain",
                }}
                source={require("../assets/icons/humidity.png")}
              />
              <Text>60%</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    height: Config.deviceHeight * 0.25,
  },
  container: {
    flex: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    width: Config.deviceWidth * 0.7,
    alignItems: "stretch",
    justifyContent: "center",
    marginLeft: Config.deviceWidth * 0.02, // Fix unaccurate track bug
  },
  track: {
    height: Config.deviceHeight * 0.028,
    borderRadius: 6,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    marginRight: Config.deviceWidth * 0.02, // Fix unaccurate track bug
  },
  thumb: {
    opacity: 0,
  },
});

export default CategoryGridTile;
