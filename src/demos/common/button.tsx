import * as React from "react";
import { CssStyleSheet } from "./cssStyleSheet";

interface ButtonProps {
	onClick?: () => void;
	style?: React.CSSProperties;
	children?: React.ReactNode ;
}
export const Button = (props: ButtonProps) => (
	<button style={{...styles.button, ...props.style}} {...props}>{props.children}</button>
);

const styles: CssStyleSheet = {
	button: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: 18,
		padding: "10px 20px",
		background: "white",
		borderRadius: "10px",
		borderColor: "#f0f0f0",
		cursor: "pointer"
	}
};
