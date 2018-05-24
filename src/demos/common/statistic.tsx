import * as React from "react";
import { CssStyleSheet } from "./cssStyleSheet";

interface StatisticProps {
	title: string;
	value: string | number;
	color?: string;
	style?: React.CSSProperties;
}
export const Statistic = (props: StatisticProps) => (
	<div style={{...styles.statistic, ...props.style}}>
		<div style={{...styles.value, color: props.color}}>
			{props.value}
		</div>
		<div style={styles.title}>
			{props.title}
		</div>
	</div>
);

const styles: CssStyleSheet = {
	statistic: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	value: {
		fontSize: 28
	},
	title: {
		fontSize: 18
	}
};
