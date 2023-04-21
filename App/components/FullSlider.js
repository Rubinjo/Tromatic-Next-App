import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { fancyTimeFormat } from "../utils/helper"

import { Slider } from "@miblanchard/react-native-slider";
import Stopwatch from "../assets/icons/Stopwatch"

const FullSlider = (props) => {

    return (
        <View>
            <View style={styles.sliderContainer}>
                <Slider
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    maximumValue={props.totalTime}
                    minimumValue={-props.totalTime * 0.08} // Ensure track border radius stays intact
                    step={1}
                    value={props.remainingTime}
                    // disabled={true}
                    minimumTrackStyle={{ backgroundColor: props.remainingTime == 0 ? "transparent" : Colors.PrimaryForeground }}
                    maximumTrackStyle={{ backgroundColor: props.remainingTime == 0 ? "transparent" : Colors.PrimaryBackground, borderWidth: props.remainingTime == 0 ? Config.deviceWidth * 0.005 : 0, borderColor: props.remainingTime == 0 ? Colors.Active : null }}
                // minimumTrackTintColor={props.remainingTime == 0 ? "transparent" : Colors.PrimaryForeground}
                // maximumTrackTintColor={ }
                />
            </View>
            <View
                style={{
                    position: "absolute",
                    flexDirection: "row",
                    alignSelf: "center",
                }}
            >
                <View style={{ flexDirection: "row", paddingHorizontal: 3 + Config.deviceWidth * 0.03 }}>
                    {props.remainingTime > 0 && <Stopwatch style={{ alignSelf: "center", paddingHorizontal: Config.deviceWidth * 0.02 }} />}
                    <Text
                        style={{
                            fontFamily: props.remainingTime == 0 ? "noto-sans-jp-bold" : "noto-sans-jp-regular",
                            color: props.remainingTime == 0 ? Colors.Active : Colors.TextLight,
                            paddingHorizontal: Config.deviceWidth * 0.02,
                        }}
                    >
                        {props.remainingTime == 0 ? "Ready for operation" : "Time remainin"}
                    </Text>
                </View>
                {props.remainingTime > 0 && <Text style={{
                    fontFamily: "noto-sans-jp-bold",
                    color: Colors.TextLight,
                    paddingHorizontal: 3 + Config.deviceWidth * 0.03
                }}>
                    {fancyTimeFormat(props.remainingTime)}
                </Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        // flex: 1,
        width: Config.deviceWidth * 0.84,
        alignItems: "stretch",
        justifyContent: "center",
        marginLeft: Config.deviceWidth * 0.02, // Fix unaccurate track bug
    },
    track: {
        height: Config.deviceHeight * 0.045,
        borderRadius: 24,
        marginRight: Config.deviceWidth * 0.02, // Fix unaccurate track bug
    },
    thumb: {
        opacity: 0,
    }
});

export default FullSlider;
