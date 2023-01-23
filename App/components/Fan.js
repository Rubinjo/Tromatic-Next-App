import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated, Easing } from "react-native";
import Config from "../utils/config";

const Fan = (props) => {
    const [rotateValue, setRotateValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: false
            })).start()
    }, [])

    const interpolateRotation = rotateValue.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-360deg", "360deg"]
    })
    return (
        <View>
            <Animated.Image
                style={{
                    height: 24 + Config.deviceHeight * 0.15,
                    width: 24 + Config.deviceHeight * 0.15,
                    resizeMode: "contain",
                    transform: [{ rotate: interpolateRotation }]
                }}
                source={require("../assets/icons/fan.png")}
            />
            <Text style={{ position: "absolute", alignSelf: "center", top: "45%", color: "black" }}>{props.rpm}</Text>
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

export default Fan;