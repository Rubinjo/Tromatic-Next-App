import * as React from "react";
import { View } from "react-native";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const originalWidth = 47;
const originalHeight = 40;
const aspectRatio = originalWidth / originalHeight;
const Warning = (props) => (
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
					<Path d="M0 0h3.937v24.385H0z" />
				</ClipPath>
			</Defs>
			<Path
				fill="#ffd800"
				d="M19.189 7.338a5 5 0 0 1 8.622 0l14.764 25.129A5 5 0 0 1 38.263 40H8.737a5 5 0 0 1-4.311-7.533Z"
			/>
			<G
				fill="#161615"
				clipPath="url(#a)"
				transform="translate(21.531 11)"
			>
				<Path d="M1.969 20.448a1.969 1.969 0 1 0 1.969 1.968 1.968 1.968 0 0 0-1.969-1.968M1.969 18.879a1.25 1.25 0 0 0 1.25-1.251l.718-15.659a1.969 1.969 0 0 0-3.937 0l.718 15.659a1.251 1.251 0 0 0 1.251 1.251" />
			</G>
		</Svg>
	</View>
);
export default Warning;
