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
    // const [timer, setTimer] = useState(0)

    // useEffect(() => {
    //     setTimer(props.remainingTime)
    //     const scheduler = () => {
    //         setTimer((timer) => {
    //             if (timer > 0) {
    //                 return timer - 1
    //             } else {
    //                 clearInterval(interval)
    //                 return timer
    //             }
    //         })
    //     }
    //     const interval = setInterval(scheduler, 1000)
    //     return () => clearInterval(interval)
    // }, [props.remainingTime])

    return (
        <View>
            <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                maximumValue={100}
                step={1}
                value={props.remainingTime}
                // onValueChange={(value) => setValue(value)}
                disabled={true}
                minimumTrackTintColor={Colors.PrimaryColor}
                maximumTrackTintColor={Colors.SecondaryColor}
            />
            <Text style={{ position: "absolute", alignSelf: "center", top: "30%", color: "white" }}>
                {fancyTimeFormat(props.remainingTime)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    track: {
        height: Config.deviceHeight * 0.028,
    },
    thumb: {
        opacity: 0,
    },
});

export default FullSlider;
