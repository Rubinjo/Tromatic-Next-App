import React, { useEffect } from "react";
import { View, Animated, Easing } from "react-native";
import Fan from "../assets/icons/Fan";

const AnimatedFan = ({ height, width, color, direction }) => {
    const rotateValue = new Animated.Value(direction);

    const AnimatedObject = Animated.createAnimatedComponent(Fan);

    useEffect(() => {
        rotateValue.setValue(direction);
    }, [direction]);

    useEffect(() => {
        let animation = Animated.loop(
            Animated.timing(rotateValue, {
                toValue: Math.abs(direction - 1),
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animation.start();

        return () => {
            animation.stop();
        };
    }, [rotateValue]);

    const interpolateRotation = rotateValue.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-360deg", "360deg"],
    });
    return (
        <View>
            <AnimatedObject
                height={height}
                width={width}
                color={color}
                style={{
                    transform: [{ rotate: interpolateRotation }],
                }}
            />
        </View>
    );
};

export default AnimatedFan;
