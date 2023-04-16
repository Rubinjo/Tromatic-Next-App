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
                    minimumTrackTintColor={Colors.PrimaryForeground}
                    maximumTrackTintColor={Colors.PrimaryBackground}
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
                    <Stopwatch style={{ alignSelf: "center", paddingHorizontal: Config.deviceWidth * 0.02 }} />
                    <Text
                        style={{
                            fontFamily: "noto-sans-jp-regular",
                            color: Colors.TextLight,
                            paddingHorizontal: Config.deviceWidth * 0.02,
                        }}
                    >
                        Time remaining
                    </Text>
                </View>
                <Text style={{
                    fontFamily: "noto-sans-jp-bold",
                    color: Colors.TextLight,
                    paddingHorizontal: 3 + Config.deviceWidth * 0.03
                }}>
                    {fancyTimeFormat(props.remainingTime)}
                </Text>
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
