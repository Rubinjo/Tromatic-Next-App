import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator,
	SafeAreaView,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { UserAuth } from "../context/AuthContext";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import BesBollmannLogo from "../assets/logos/Bes_Bollmann";

const ResetPasswordScreen = (props) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const { resetPasswordAccount } = UserAuth();

	// Show alert when error occurs
	useEffect(() => {
		if (error) {
			Alert.alert(i18n.t("general.error.error"), error, [
				{ text: i18n.t("general.okAllCaps") },
			]);
		}
	}, [error]);

	const resetPasswordEmail = async () => {
		setError(null);
		if (!email) {
			setError(i18n.t("authentication.error.email"));
		} else {
			setIsLoading(true);
			try {
				console.log("Resetting password for email: " + email);
				await resetPasswordAccount(email);
				console.log("Reset password email sent");
				props.navigation.navigate("ResetConfirm");
				setIsLoading(false);
			} catch (err) {
				console.log(err.message);
				setIsLoading(false);
				setError(i18n.t("authentication.error.databaseError"));
			}
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View
				style={{
					marginBottom: "auto",
					marginTop:
						Platform.OS == "ios"
							? Config.deviceHeight * 0.02
							: 20 + Config.deviceHeight * 0.06,
				}}
			>
				<TromaticNextLogo
					height={
						Config.deviceWidth < 768
							? Config.deviceWidth * 0.2
							: 142 + (Config.deviceWidth * 0.05 - 39)
					}
					color={Colors.PrimaryLight}
				/>
			</View>

			<View
				style={{
					alignItems: "center",
					flex: 1,
				}}
			>
				<View style={styles.textInputContainer}>
					<View style={styles.textInputBox}>
						<View style={styles.textInputIconBox}>
							<MaterialIcons
								name="alternate-email"
								size={Config.deviceWidth * 0.075}
								color={Colors.Secondary}
							/>
						</View>
						<TextInput
							style={styles.textInput}
							autoCompleteType="email"
							placeholder={i18n.t("general.email")}
							placeholderTextColor={Colors.PrimaryDark}
							keyboardType="email-address"
							returnKeyType="done"
							textContentType="emailAddress"
							value={email}
							onChangeText={(email) => setEmail(email)}
						/>
					</View>
				</View>
				{isLoading ? (
					<ActivityIndicator size="large" color="white" />
				) : (
					<TouchableOpacity
						style={styles.button}
						onPress={resetPasswordEmail}
					>
						<Text
							style={[
								styles.headText,
								{
									fontSize:
										Config.deviceWidth < 768
											? Config.deviceWidth * 0.07
											: 54 +
											  (Config.deviceWidth * 0.025 - 20),
								},
							]}
						>
							{i18n.t("authentication.reset")}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<View
				style={{
					marginBottom: Config.deviceHeight * 0.02,
				}}
			>
				<BesBollmannLogo
					height={
						Config.deviceWidth < 768
							? Config.deviceWidth * 0.07
							: 56 + (Config.deviceWidth * 0.025 - 20)
					}
					color={Colors.PrimaryLight}
				/>
			</View>
		</SafeAreaView>
	);
};

export const stackOptions = (navData) => {
	return {
		headerShown: false,
	};
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.Primary,
		alignItems: "center",
	},
	textInputContainer: {
		height: Config.deviceHeight * 0.12,
		marginTop: Config.deviceHeight * 0.04,
		marginBottom: Config.deviceHeight * 0.08,
	},
	textInputBox: {
		flex: 1,
		flexDirection: "row",
	},
	textInputIconBox: {
		width: Config.deviceWidth * 0.15,
		height: "80%",
		backgroundColor: Colors.SecondaryLight,
		borderTopLeftRadius: Config.deviceWidth * 0.012,
		borderBottomLeftRadius: Config.deviceWidth * 0.012,
		alignItems: "center",
		justifyContent: "center",
	},
	textInput: {
		width: Config.deviceWidth * 0.65,
		height: "80%",
		backgroundColor: "white",
		borderTopRightRadius: Config.deviceWidth * 0.012,
		borderBottomRightRadius: Config.deviceWidth * 0.012,
		paddingHorizontal: Config.deviceWidth * 0.04,
		fontSize: Config.deviceWidth * 0.05,
	},
	headText: {
		fontFamily: "noto-sans-jp-bold",
		color: "white",
		fontSize: Config.deviceWidth * 0.07,
	},
	button: {
		backgroundColor: Colors.Secondary,
		borderRadius: Config.deviceWidth * 0.018,
		paddingHorizontal: Config.deviceWidth * 0.2,
		paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.015 : 0,
	},
});

export default ResetPasswordScreen;
