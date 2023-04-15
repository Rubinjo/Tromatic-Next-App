import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"
const Stopwatch = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} {...props}>
    <Defs>
      <ClipPath id="a">
        <Path fill="none" stroke="#fff" strokeWidth={1.5} d="M0 0h21v21H0z" />
      </ClipPath>
    </Defs>
    <G
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M2.87.698.698 2.87M18.072.698l2.172 2.172M19.158 11.558a8.687 8.687 0 1 1-8.687-8.687 8.687 8.687 0 0 1 8.687 8.687Z" />
      <Path d="M10.471 8.299v3.258l2.172 2.172" />
    </G>
  </Svg>
)
export default Stopwatch