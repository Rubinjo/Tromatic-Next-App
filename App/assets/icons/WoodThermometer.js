import * as React from "react";
import { View } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";

const originalWidth = 43.584;
const originalHeight = 36.521;
const aspectRatio = originalWidth / originalHeight;
const WoodThermometer = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
		>
			<G
				stroke={props.color}
				strokeLinecap="round"
				strokeMiterlimit={10}
				strokeWidth={1.5}
			>
				<Path d="M35.695 6.218V24.69" />
				<G transform="translate(1.053 .75)">
					<Circle
						cx={3.272}
						cy={3.272}
						r={3.272}
						transform="translate(31.37 24.407)"
					/>
					<Path d="M38.621 21.957a7.138 7.138 0 1 1-11.119 5.924 7.023 7.023 0 0 1 3.156-5.956V3.979a3.979 3.979 0 0 1 7.958 0ZM27.22 7.742H0v22.692h23.521" />
					<Path d="M27.22 16.82H11.677A58.285 58.285 0 0 0 0 17.713M25.607 21.358H12.093c-4.274 0-9.255.99-12.093 2.459M0 30.434c4.391-3.452 10.988-4.538 16.509-4.538H23.1M0 12.281h2.63c7.366 0 13.767-1.835 17.081-4.538M26.302 7.743c-1.687 1.984-3.666 3.956-5.178 4.538h6.1" />
				</G>
			</G>
		</Svg>
	</View>
);
export default WoodThermometer;
