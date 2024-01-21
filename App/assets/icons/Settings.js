import * as React from "react";
import { View } from "react-native";
import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

const originalWidth = 23.04;
const originalHeight = 17.368;
const aspectRatio = originalWidth / originalHeight;
const Settings = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
			fill="none"
		>
			<Defs>
				<ClipPath id="a">
					<Path
						stroke={props.color}
						strokeWidth={1.5}
						d="M0 0h23.04v17.368H0z"
					/>
				</ClipPath>
			</Defs>
			<G
				stroke={props.color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				clipPath="url(#a)"
			>
				<Circle
					cx={3.403}
					cy={3.403}
					r={3.403}
					transform="translate(10.386 9.818)"
				/>
				<Path d="M22.298 13.222h-5.105M10.386 13.222H.743" />
				<Circle
					cx={3.403}
					cy={3.403}
					r={3.403}
					transform="translate(5.848 .743)"
				/>
				<Path d="M22.297 4.146h-9.643M5.849 4.146H.744" />
			</G>
		</Svg>
	</View>
);
export default Settings;
