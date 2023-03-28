import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import FullSlider from "./FullSlider";

import Light from "./Light";
import Config from "../utils/config";
import Status from "../assets/constants/status";

const CategoryGridTile = (props) => {
  return (
    <View style={styles.gridItem}>
      <TouchableNativeFeedback onPress={props.onSelect}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "auto",
              marginRight: "auto",
              marginTop: 1 + Config.deviceHeight * 0.005,
              marginLeft: 1 + Config.deviceWidth * 0.08,
            }}
          >
            <Light color={(props.item.status - 65537 < 12) ? ((props.item.status - 65537 == 0) ? "green" : "yellow") : "red"} />
            <View
              style={{ flex: 1, marginLeft: 1 + Config.deviceWidth * 0.02 }}
            >
              <Text
                style={{
                  fontFamily: "noto-sans-jp-bold",
                  fontSize: 5 + Config.deviceHeight * 0.02,
                  color: "black",
                }}
              >
                {props.item.type}
              </Text>
            </View>
            {(props.item.status - 65537 >= 12) && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: Config.deviceWidth * 0.08,
                }}
              >
                <Image
                  style={{
                    height: 5 + Config.deviceHeight * 0.04,
                    width: 5 + Config.deviceHeight * 0.04,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/icons/warning.png")}
                />
                <View style={{ marginLeft: 1 + Config.deviceWidth * 0.02 }}>
                  <Text
                    style={{
                      fontFamily: "noto-sans-jp-regular",
                      fontSize: 4 + Config.deviceHeight * 0.015,
                      color: "black",
                    }}
                  >
                    {Status[props.item.status - 65537]}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: "auto",
              marginTop: Config.deviceHeight * 0.01,
            }}
          >
            <FullSlider remainingTime={props.item.remainingTime} totalTime={props.item.totalTime} />
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
                source={require("../assets/icons/thermometer.png")}
              />
              <View>
                <Text>{props.item.currentTemp} °C</Text>
                <View style={{ borderBottomWidth: 1 }} />
                <Text>{props.item.setPointTemp} °C</Text>
              </View>
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
              <View>
                <Text>{props.item.currentHum}%</Text>
                <View style={{ borderBottomWidth: 1 }} />
                <Text>{props.item.setPointHum}%</Text>
              </View>
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
                source={require("../assets/icons/fan.png")}
              />
              <Text>{props.item.RPM}%</Text>
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
                source={require("../assets/icons/atom.png")}
              />
              <Text>{Math.min(props.item.WMValue1, props.item.WMValue2, props.item.WMValue3, props.item.WMValue4, props.item.WMValue5, props.item.WMValue6, props.item.WMValue7, props.item.WMValue8, props.item.WMValue9, props.item.WMValue10)} °C</Text>
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
});

export default CategoryGridTile;
