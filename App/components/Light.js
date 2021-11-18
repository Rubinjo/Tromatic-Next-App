import React from "react";
import { View, StyleSheet } from "react-native";

import Config from "../utils/config";

const Light = (props) => {
  return (
    <View style={styles.lCircle}>
      <View style={{ ...styles.sCircle, backgroundColor: props.color }}>
        <View style={styles.accent}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lCircle: {
    width: Config.deviceWidth * 0.06,
    height: Config.deviceWidth * 0.06,
    borderRadius: Config.deviceWidth * 0.03,
    borderWidth: 1.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  sCircle: {
    width: Config.deviceWidth * 0.044,
    height: Config.deviceWidth * 0.044,
    borderRadius: Config.deviceWidth * 0.022,
    borderWidth: 1,
  },
  accent: {
    width: Config.deviceWidth * 0.014,
    height: Config.deviceWidth * 0.014,
    borderRadius: Config.deviceWidth * 0.007,
    backgroundColor: "white",
    opacity: 0.75,
    top: "16%",
    left: "19%",
  },
});

export default Light;
