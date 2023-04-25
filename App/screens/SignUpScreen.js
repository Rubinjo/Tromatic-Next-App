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
import { Ionicons } from "@expo/vector-icons";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import { registration } from "../auth/firebase";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import BesBollmannLogo from "../assets/logos/Bes_Bollmann";

const SignUpScreen = (props) => {
	const [companyID, setCompanyID] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	// Show alert when error occurs
	useEffect(() => {
		if (error) {
			Alert.alert(i18n.t("authentication.error.title"), error, [
				{ text: "OK" },
			]);
		}
	}, [error]);

	// Register user
	// uses Firebase Auth
	const signUp = async () => {
		setError(null);
		if (!companyID) {
			setError(i18n.t("authentication.error.companyId"));
		} else if (!fullName) {
			setError(i18n.t("authentication.error.name"));
		} else if (!email) {
			setError(i18n.t("authentication.error.email"));
		} else if (!password) {
			setError(i18n.t("authentication.error.password"));
		} else if (!confirmPassword) {
			setPassword("");
			setError(i18n.t("authentication.error.passwordConfirm"));
		} else if (password !== confirmPassword) {
			setPassword("");
			setConfirmPassword("");
			setError(i18n.t("authentication.error.passwordMatch"));
		} else {
			setIsLoading(true);
			try {
				await registration(companyID, fullName, email, password);
			} catch (err) {
				console.log(err.message);
				setIsLoading(false);
				setError(err);
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
							<Ionicons
								name="ios-business-outline"
								size={Config.deviceWidth * 0.075}
								color={Colors.Secondary}
							/>
						</View>
						<TextInput
							style={styles.textInput}
							placeholder={i18n.t("authentication.companyId")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="next"
							blurOnSubmit={false}
							onSubmitEditing={() => {
								this.nameInput.focus();
							}}
							textContentType="organizationName"
							value={companyID}
							onChangeText={(id) => {
								setCompanyID(id);
							}}
						/>
					</View>
					<View style={styles.textInputBox}>
						<View style={styles.textInputIconBox}>
							<Ionicons
								name="person-outline"
								size={Config.deviceWidth * 0.075}
								color={Colors.Secondary}
							/>
						</View>
						<TextInput
							style={styles.textInput}
							placeholder={i18n.t("authentication.name")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="next"
							blurOnSubmit={false}
							ref={(input) => {
								this.nameInput = input;
							}}
							onSubmitEditing={() => {
								this.emailInput.focus();
							}}
							textContentType="name"
							value={fullName}
							onChangeText={(name) => {
								setFullName(name);
							}}
						/>
					</View>
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
							placeholder={i18n.t("authentication.email")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="next"
							keyboardType="email-address"
							blurOnSubmit={false}
							ref={(input) => {
								this.emailInput = input;
							}}
							onSubmitEditing={() => {
								this.passwordInput.focus();
							}}
							textContentType="emailAddress"
							value={email}
							onChangeText={(email) => setEmail(email)}
						/>
					</View>
					<View style={styles.textInputBox}>
						<View style={styles.textInputIconBox}>
							<MaterialIcons
								name="lock-outline"
								size={Config.deviceWidth * 0.075}
								color={Colors.Secondary}
							/>
						</View>
						<TextInput
							style={styles.textInput}
							placeholder={i18n.t("authentication.password")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="next"
							blurOnSubmit={false}
							ref={(input) => {
								this.passwordInput = input;
							}}
							onSubmitEditing={() => {
								this.confirmPasswordInput.focus();
							}}
							textContentType="newPassword"
							value={password}
							onChangeText={(password) => setPassword(password)}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.textInputBox}>
						<View style={styles.textInputIconBox}>
							<MaterialIcons
								name="lock-outline"
								size={Config.deviceWidth * 0.075}
								color={Colors.Secondary}
							/>
						</View>
						<TextInput
							style={styles.textInput}
							placeholder={i18n.t("authentication.confirm")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="done"
							ref={(input) => {
								this.confirmPasswordInput = input;
							}}
							textContentType="newPassword"
							value={confirmPassword}
							onChangeText={(password2) =>
								setConfirmPassword(password2)
							}
							secureTextEntry={true}
						/>
					</View>
				</View>
				{isLoading ? (
					<ActivityIndicator size="large" color="white" />
				) : (
					<TouchableOpacity style={styles.button} onPress={signUp}>
						<Text
							style={[
								styles.headText,
								{ fontSize: Config.deviceWidth * 0.07 },
							]}
						>
							{i18n.t("authentication.signUp")}
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
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.Primary,
	},
	textInputContainer: {
		height: Config.deviceHeight * 0.54,
		marginTop: Config.deviceHeight * 0.04,
		marginBottom: Config.deviceWidth * 0.075,
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
	},
	button: {
		backgroundColor: Colors.Secondary,
		borderRadius: 8,
		paddingHorizontal: Config.deviceWidth * 0.2,
		paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.015 : 0,
	},
});

export default SignUpScreen;
