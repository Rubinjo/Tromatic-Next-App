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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { resetPasswordAccount } from "../auth/firebase";
import i18n from "../utils/i18n";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import BesBollmannLogo from "../assets/logos/Bes_Bollmann";

const ResetPasswordScreen = (props) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	// Show alert when error occurs
	useEffect(() => {
		if (error) {
			Alert.alert(i18n.t("general.error"), error, [
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
				await resetPasswordAccount(email, language);
				props.navigation.navigate("ResetConfirm");
				setIsLoading(false);
			} catch (err) {
				console.log(err.message);
				setIsLoading(false);
				setEmail(err);
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
					height={Config.deviceWidth * 0.2}
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
						<Text style={styles.headText}>
							{i18n.t("authentication.reset")}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<View
				style={{
					marginBottom:
						Platform.OS == "android"
							? Config.deviceHeight * 0.02
							: 0,
				}}
			>
				<BesBollmannLogo
					height={Config.deviceWidth * 0.07}
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
		marginBottom: Config.deviceWidth * 0.1,
	},
	textInputBox: {
		flex: 1,
		flexDirection: "row",
	},
	textInputIconBox: {
		width: Config.deviceWidth * 0.15,
		height: "80%",
		backgroundColor: Colors.SecondaryLight,
		borderTopLeftRadius: 6,
		borderBottomLeftRadius: 6,
		alignItems: "center",
		justifyContent: "center",
	},
	textInput: {
		width: Config.deviceWidth * 0.65,
		height: "80%",
		backgroundColor: "white",
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
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
		borderRadius: 8,
		paddingHorizontal: Config.deviceWidth * 0.2,
		paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.015 : 0,
	},
});

export default ResetPasswordScreen;
