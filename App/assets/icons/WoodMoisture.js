import * as React from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

const originalWidth = 51.102;
const originalHeight = 32.394;
const aspectRatio = originalWidth / originalHeight;
const WoodMoisture = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
			fill="none"
		>
			<G
				stroke={props.color}
				strokeLinecap="round"
				strokeMiterlimit={10}
				strokeWidth={1.5}
			>
				<Path d="M39.977 1.156c-4.358 5.112-11.052 13.569-10.322 21.567.554 6.094 5.514 8.921 10.324 8.921h0c4.81 0 9.77-2.827 10.324-8.921.726-7.998-5.967-16.455-10.326-21.567Z" />
				<Path d="M43.769 15.235s2.179 6.893-.61 11.248M30.919 5.903H1.053v22.475h25.941" />
				<Path d="M26.416 14.894h-13.8a57.73 57.73 0 0 0-11.563.885M24.995 19.388H13.031c-4.233 0-9.167.981-11.978 2.436M1.053 28.378c4.349-3.419 10.884-4.5 16.352-4.5h7.866M1.053 10.398h2.605c7.3 0 13.636-1.818 16.918-4.495M27.101 5.902c-1.671 1.965-3.631 3.918-5.128 4.5h6.038" />
			</G>
		</Svg>
	</View>
);
export default WoodMoisture;
