import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Config from "../utils/config";

const Counter = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => props.onChange(props.item, props.setter + 1)}
        style={[
          styles.input,
          {
            borderTopLeftRadius: Config.deviceWidth * 0.04,
            borderTopRightRadius: Config.deviceWidth * 0.04,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: Config.deviceHeight * 0.07,
              marginTop: -Config.deviceHeight * 0.056,
            },
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
      <View
        style={[
          styles.input,
          {
            height: Config.deviceHeight * 0.08,
            flexDirection: "row",
            // justifyContent: "space-evenly",
          },
        ]}
      >
        <View style={{ height: "100%", width: "50%", backgroundColor: "silver", justifyContent: "center" }}>
          <Text style={{ position: "absolute", top: "0%", right: "0%" }}>
            A
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: Config.deviceHeight * 0.045,
                alignSelf: "center",
              },
            ]}
          >
            {props.actual}
          </Text>
        </View>

        <View style={{ height: "100%", borderLeftWidth: 1 }} />
        <View style={{ height: "100%", width: "50%", justifyContent: "center" }}>
          <Text style={{ position: "absolute", top: "0%", right: "0%" }}>
            S
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: Config.deviceHeight * 0.045,
                alignSelf: "center",
              },
            ]}
          >
            {props.setter}
          </Text>
        </View>

      </View>
      <TouchableOpacity
        onPress={() => props.onChange(props.item, props.setter - 1)}
        style={[
          styles.input,
          {
            borderBottomLeftRadius: Config.deviceWidth * 0.04,
            borderBottomRightRadius: Config.deviceWidth * 0.04,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: Config.deviceHeight * 0.09,
              marginTop: -Config.deviceHeight * 0.095,
            },
          ]}
        >
          -
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "noto-sans-jp-regular",
  },
  input: {
    width: Config.deviceWidth * 0.24,
    height: Config.deviceHeight * 0.09,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Counter;
