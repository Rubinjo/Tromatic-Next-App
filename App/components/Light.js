import React from "react";
import { View, StyleSheet } from "react-native";

import Config from "../utils/config";

const Light = (props) => {
  return (
    <View style={{ ...styles.lCircle, backgroundColor: props.color }}>
    </View>
  );
};

const styles = StyleSheet.create({
  lCircle: {
    width: Config.deviceWidth * 0.06,
    height: Config.deviceWidth * 0.06,
    borderRadius: Config.deviceWidth * 0.03,
    // borderWidth: 1.5,
    // justifyContent: "center",
    // alignItems: "center",
  },
  sCircle: {
    width: Config.deviceWidth * 0.044,
    height: Config.deviceWidth * 0.044,
    borderRadius: Config.deviceWidth * 0.022,
    borderWidth: 1,
  }
});

export default Light;
