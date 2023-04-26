import React, { useState, useEffect } from "react";
import { View, Animated, Easing } from "react-native";
import Fan from "../assets/icons/Fan";

const AnimatedFan = (props) => {
	const [rotateValue] = useState(new Animated.Value(props.direction));

	const AnimatedObject = Animated.createAnimatedComponent(Fan);

	useEffect(() => {
		rotateValue.setValue(props.direction);
		Animated.loop(
			Animated.timing(rotateValue, {
				toValue: Math.abs(props.direction - 1),
				duration: 5000,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, [props.direction]);

	const interpolateRotation = rotateValue.interpolate({
		inputRange: [-1, 1],
		outputRange: ["-360deg", "360deg"],
	});
	return (
		<View>
			<AnimatedObject
				height={props.height}
				width={props.width}
				color={props.color}
				style={{
					transform: [{ rotate: interpolateRotation }],
				}}
			/>
		</View>
	);
};

export default AnimatedFan;
