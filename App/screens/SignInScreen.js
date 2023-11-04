import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Image,
	ActivityIndicator,
	Alert,
	Platform,
	SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from "@expo/vector-icons";

import { UserAuth } from "../context/AuthContext";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import { updateLanguage } from "../store/slices/language";
import i18n from "../utils/i18n";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import BesBollmannLogo from "../assets/logos/Bes_Bollmann";

const SignInScreen = (props) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{
			label: "English",
			value: "en",
			icon: () => (
				<View style={{ flexDirection: "row" }}>
					<Image
						source={require("../assets/flags/united-kingdom.png")}
						style={[
							styles.icon,
							{ marginRight: Config.deviceWidth * 0.005 },
						]}
					/>
					<Image
						source={require("../assets/flags/united-states-of-america.png")}
						style={styles.icon}
					/>
				</View>
			),
		},
		{
			label: "Deutsch",
			value: "de",
			icon: () => (
				<Image
					source={require("../assets/flags/germany.png")}
					style={styles.icon}
				/>
			),
		},
		{
			label: "Nederlands",
			value: "nl",
			icon: () => (
				<Image
					source={require("../assets/flags/netherlands.png")}
					style={styles.icon}
				/>
			),
		},
	]);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const { signInAccount } = UserAuth();

	// Update language setting when redux store is loaded
	useEffect(() => {
		setValue(language);
		i18n.locale = language;
	}, [language]);

	// Show alert when error occurs
	useEffect(() => {
		if (error) {
			Alert.alert(i18n.t("autentication.error.signInError"), error, [
				{ text: i18n.t("general.okAllCaps") },
			]);
		}
	}, [error]);

	// Load language from the redux store
	const language = useSelector((state) => state.language.language);

	const dispatch = useDispatch();

	// Login user
	// uses Firebase Auth
	const signInUser = async () => {
		setError(null);
		if (!email) {
			setError(i18n.t("authentication.error.email"));
		} else if (!password) {
			setError("authentication.error.password");
		} else {
			setIsLoading(true);
			try {
				await signInAccount(email, password, i18n.locale);
			} catch (err) {
				console.log(err.message);
				setEmail("");
				setPassword("");
				setIsLoading(false);
				setError(err.message);
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
							placeholderTextColor={Colors.SecondaryDark}
							keyboardType="email-address"
							returnKeyType="next"
							onSubmitEditing={() => {
								this.passwordInput.focus();
							}}
							blurOnSubmit={false}
							textContentType="emailAddress"
							value={email}
							onChangeText={(email) => setEmail(email)}
							importantForAutofill="yes"
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
							autoCompleteType="password"
							placeholder={i18n.t("general.password")}
							placeholderTextColor={Colors.SecondaryDark}
							returnKeyType="done"
							ref={(input) => {
								this.passwordInput = input;
							}}
							textContentType="password"
							value={password}
							onChangeText={(password) => setPassword(password)}
							importantForAutofill="yes"
							secureTextEntry={true}
						/>
					</View>
				</View>
				<View
					style={{
						alignItems: "center",
					}}
				>
					{isLoading ? (
						<ActivityIndicator size="large" color="white" />
					) : (
						<TouchableOpacity
							style={styles.button}
							onPress={signInUser}
						>
							<Text
								style={[
									styles.headText,
									{ fontSize: Config.deviceWidth * 0.07 },
								]}
							>
								{i18n.t("authentication.signIn")}
							</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate("ResetPassword");
						}}
					>
						<Text style={styles.headText}>
							{i18n.t("authentication.forgot")}
						</Text>
					</TouchableOpacity>
				</View>
				<DropDownPicker
					style={{
						width: Config.deviceWidth * 0.5,
						marginTop: Config.deviceHeight * 0.01,
						borderColor: "darkgrey",
					}}
					dropDownContainerStyle={{
						width: Config.deviceWidth * 0.5,
						alignSelf: "center",
						borderColor: "darkgrey",
					}}
					dropDownDirection="BOTTOM"
					open={open}
					value={value}
					items={items}
					setOpen={setOpen}
					setValue={setValue}
					setItems={setItems}
					onChangeValue={(value) => {
						i18n.locale = value;
						try {
							dispatch(updateLanguage(value));
						} catch (err) {
							console.log(err);
							setError(err.message);
						}
					}}
				/>
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
			<View style={{ flexDirection: "row", marginTop: "auto" }}>
				<Text style={styles.text}>
					{i18n.t("authentication.account")}
				</Text>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate("SignUp");
					}}
				>
					<Text
						style={[
							styles.headText,
							{ color: Colors.SecondaryLight },
						]}
					>
						{i18n.t("authentication.signUp")}
					</Text>
				</TouchableOpacity>
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
		height: Config.deviceHeight * 0.225,
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
		paddingHorizontal: Config.deviceWidth * 0.04,
		fontSize: Config.deviceWidth * 0.05,
		borderBottomRightRadius: 6,
		borderTopRightRadius: 6,
	},
	headText: {
		fontFamily: "noto-sans-jp-bold",
		color: Colors.PrimaryLight,
	},
	text: {
		fontFamily: "noto-sans-jp-regular",
		color: Colors.PrimaryLight,
		marginRight: 6,
	},

	button: {
		backgroundColor: Colors.Secondary,
		borderRadius: 8,
		paddingHorizontal: Config.deviceWidth * 0.2,
		paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.015 : 0,
	},
	icon: {
		width: 25,
		height: 25,
	},
});

export default SignInScreen;
