import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Valve = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={36.627}
        height={21.334}
        {...props}
    >
        <Path
            fill="none"
            stroke="#1aa3ff"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="M3.378 10.667h29.871"
        />
        <Path
            fill="none"
            stroke="#1aa3ff"
            strokeDasharray="1 3"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m6.123 2.89 25.188 16.057"
        />
        <Path
            fill="#1aa3ff"
            d="M21.653 10.667a3.332 3.332 0 1 1-3.332-3.332 3.332 3.332 0 0 1 3.332 3.332"
        />
        <Path
            fill="none"
            stroke="#1aa3ff"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="M35.877.75v19.834M.75.75v19.834"
        />
    </Svg>
)
export default Valve
