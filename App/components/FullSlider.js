import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import fancyTimeFormat from "../utils/helper"

import { Slider } from "@miblanchard/react-native-slider";

const FullSlider = (props) => {
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        setTimer(props.remainingTime)
        const scheduler = () => {
            setTimer((timer) => {
                if (timer > 0) {
                    return timer - 1
                } else {
                    clearInterval(interval)
                    return timer
                }
            })
        }
        const interval = setInterval(scheduler, 1000)
        return () => clearInterval(interval)
    }, [props.remainingTime])

    return (
        <View>
            <View style={styles.sliderContainer}>
                <Slider
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    maximumValue={props.totalTime}
                    step={1}
                    value={timer}
                    // onValueChange={(value) => setValue(value)}
                    disabled={true}
                    minimumTrackTintColor={Colors.PrimaryColor}
                    maximumTrackTintColor={Colors.SecondaryColor}
                />
            </View>
            <View
                style={{
                    flex: 1,
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
                    Time left: {fancyTimeFormat(timer)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        flex: 1,
        width: Config.deviceWidth * 0.85,
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
    }
});

export default FullSlider;
