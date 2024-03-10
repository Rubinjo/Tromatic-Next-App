import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { fancyTimeFormat } from "../utils/helper";
import Stopwatch from "../assets/icons/Stopwatch";

import { Slider } from "@miblanchard/react-native-slider";
import i18n from "../utils/i18n";

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
				minimumTrackTintColor={Colors.Secondary}
				maximumTrackTintColor={Colors.Primary}
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
						marginTop:
							Config.deviceHeight < 768
								? Config.deviceHeight * 0.014
								: Config.deviceHeight < 1024
								? Config.deviceHeight * 0.008
								: Config.deviceHeight * 0.005,
					}}
				>
					<Stopwatch
						width={
							Config.deviceWidth < 720
								? Config.deviceWidth * 0.05
								: 36 + Config.deviceWidth * 0.005 - 3.5
						}
						color={Colors.PrimaryLight}
						marginTop={
							Platform.OS === "android"
								? Config.deviceHeight * 0.01
								: 0
						}
					/>
					<Text
						style={{
							fontFamily: "noto-sans-jp-regular",
							fontSize: 6 + Config.deviceHeight * 0.01,
							color: Colors.PrimaryLight,
							paddingHorizontal: Config.deviceWidth * 0.02,
						}}
					>
						{i18n.t("general.timeRemaining")}
					</Text>
					<Text
						style={{
							fontFamily: "noto-sans-jp-bold",
							fontSize: 6 + Config.deviceHeight * 0.01,
							color: Colors.PrimaryLight,
							paddingHorizontal: 3 + Config.deviceWidth * 0.03,
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
		height: Config.deviceHeight * 0.06,
	},
	thumb: {
		opacity: 0,
	},
});

export default FullSlider;
