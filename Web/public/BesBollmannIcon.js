import * as React from "react";

const BesBollmannIcon = (props) => {
	const { className, ...otherProps } = props;
	const originalWidth = 28.02;
	const originalHeight = 28.02;
	const aspectRatio = originalWidth / originalHeight;
	return (
		<div className={`aspect-[${aspectRatio}] ${className}`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				viewBox={`0 0 ${originalWidth} ${originalHeight}`}
				{...otherProps}
			>
				<path
					fill="#fff"
					d="M0 0v28.02h10.35V5.187H8.377V10.2L6.592 8.726l-1.258 1.52 3.042 2.518v6.385L7.09 18.084l-2.622-2.17-1.258 1.52 3.88 3.211 1.287 1.065v4.336h-6.4V1.973h24.07v24.074H12.68v1.973h15.34V0Z"
					data-name="Path 55"
				/>
				<path
					fill="#fff"
					d="M12.753 7.154h10.89v1.973h-10.89z"
					data-name="Rectangle 140"
				/>
				<path
					fill="#fff"
					d="M12.752 11.243h10.89v1.973h-10.89z"
					data-name="Rectangle 141"
				/>
				<path
					fill="#fff"
					d="M12.752 15.333h10.89v1.973h-10.89z"
					data-name="Rectangle 142"
				/>
				<path
					fill="#fff"
					d="M12.752 19.423h10.89v1.973h-10.89z"
					data-name="Rectangle 143"
				/>
			</svg>
		</div>
	);
};
export default BesBollmannIcon;
