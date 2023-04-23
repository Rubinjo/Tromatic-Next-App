import * as React from "react";
import { View } from "react-native";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const originalWidth = 21;
const originalHeight = 21;
const aspectRatio = originalWidth / originalHeight;
const Stopwatch = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
		>
			<Defs>
				<ClipPath id="a">
					<Path
						stroke={props.color}
						strokeWidth={1.5}
						d="M0 0h21v21H0z"
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
				<Path d="M2.87.698.698 2.87M18.072.698l2.172 2.172M19.158 11.558a8.687 8.687 0 1 1-8.687-8.687 8.687 8.687 0 0 1 8.687 8.687Z" />
				<Path d="M10.471 8.299v3.258l2.172 2.172" />
			</G>
		</Svg>
	</View>
);
export default Stopwatch;
