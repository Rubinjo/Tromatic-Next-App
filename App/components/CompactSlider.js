import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { fancyTimeFormat } from "../utils/helper";
import Stopwatch from "../assets/icons/Stopwatch";

import { Slider } from "@miblanchard/react-native-slider";

const FullSlider = (props) => {
	return (
		<View style={{ height: "100%" }}>
			<Slider
				trackStyle={styles.track}
				thumbStyle={styles.thumb}
				maximumValue={props.totalTime}
				step={1}
				value={props.remainingTime}
				disabled={true}
				minimumTrackTintColor={Colors.PrimaryForeground}
				maximumTrackTintColor={Colors.PrimaryBackground}
			/>
			<View
				style={{
					height: "100%",
					position: "absolute",
					flexDirection: "row",
					alignSelf: "center",
				}}
			>
				<View
					style={{
						height: "100%",
						flexDirection: "row",
						paddingHorizontal: 3 + Config.deviceWidth * 0.03,
						alignItems: "center",
						marginTop: Config.deviceHeight * 0.003,
					}}
				>
					<Stopwatch
						width={Config.deviceWidth * 0.05}
						color={Colors.TextLight}
						marginTop={Config.deviceHeight * 0.005}
					/>
					<Text
						style={{
							fontFamily: "noto-sans-jp-regular",
							color: Colors.TextLight,
							paddingHorizontal: Config.deviceWidth * 0.02,
						}}
					>
						Time remaining
					</Text>
					<Text
						style={{
							fontFamily: "noto-sans-jp-bold",
							color: Colors.TextLight,
							paddingHorizontal: 3 + Config.deviceWidth * 0.03,
							marginTop: Config.deviceHeight * 0.003,
						}}
					>
						{fancyTimeFormat(props.remainingTime)}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	track: {
		height: "100%",
	},
	thumb: {
		opacity: 0,
	},
});

export default FullSlider;
