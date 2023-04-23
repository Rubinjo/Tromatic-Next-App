import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	Animated,
	Easing,
} from "react-native";
import Config from "../utils/config";
import Fan from "../assets/icons/Fan";
import Colors from "../assets/constants/colors";

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

export default AnimatedFan;
