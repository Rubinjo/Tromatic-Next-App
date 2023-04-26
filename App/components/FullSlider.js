import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { fancyTimeFormat } from "../utils/helper";

import { Slider } from "@miblanchard/react-native-slider";
import Stopwatch from "../assets/icons/Stopwatch";
import i18n from "../utils/i18n";

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
					disabled={true}
					minimumTrackStyle={{
						backgroundColor:
							props.remainingTime == 0
								? "transparent"
								: Colors.Secondary,
					}}
					maximumTrackStyle={{
						backgroundColor:
							props.remainingTime == 0
								? "transparent"
								: Colors.Primary,
						borderWidth:
							props.remainingTime == 0
								? Config.deviceWidth * 0.005
								: 0,
						borderColor:
							props.remainingTime == 0 ? Colors.Active : null,
					}}
				/>
			</View>
			<View
				style={{
					position: "absolute",
					flexDirection: "row",
					alignSelf: "center",
					marginTop:
						Platform.OS === "ios" ? Config.deviceHeight * 0.01 : 0,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						paddingHorizontal: 3 + Config.deviceWidth * 0.03,
						alignItems: "center",
					}}
				>
					{props.remainingTime > 0 && (
						<Stopwatch
							width={Config.deviceWidth * 0.052}
							color={Colors.PrimaryLight}
							style={{
								alignSelf: "center",
								paddingHorizontal: Config.deviceWidth * 0.02,
							}}
						/>
					)}
					<Text
						style={{
							fontFamily:
								props.remainingTime == 0
									? "noto-sans-jp-bold"
									: "noto-sans-jp-regular",
							color:
								props.remainingTime == 0
									? Colors.Active
									: Colors.PrimaryLight,
							paddingHorizontal: Config.deviceWidth * 0.02,
						}}
					>
						{props.remainingTime == 0 ? (
							<Text>{i18n.t("general.readyForOperation")}</Text>
						) : (
							<Text>{i18n.t("general.timeRemaining")}</Text>
						)}
					</Text>
				</View>
				{props.remainingTime > 0 && (
					<Text
						style={{
							fontFamily: "noto-sans-jp-bold",
							color: Colors.PrimaryLight,
							paddingHorizontal: 3 + Config.deviceWidth * 0.03,
						}}
					>
						{fancyTimeFormat(props.remainingTime)}
					</Text>
				)}
			</View>
		</View>
	);
};

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
	},
});

export default FullSlider;
