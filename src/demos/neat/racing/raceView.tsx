import * as React from "react";
import { Network } from "../../../neural-network/model/network";
import { Button } from "../../common/button";
import { CssStyleSheet } from "../../common/cssStyleSheet";
import { Statistic } from "../../common/statistic";
import { gameService } from "./services";

interface RaceViewState {
	generation: number;
	fitness: number;
	raceTime: number;
	bestBrain?: Network;
}
export class RaceView extends React.Component<{}, RaceViewState> {

	constructor(props: {}) {
		super(props);
		this.state = { generation: 0, fitness: 0, raceTime: 0 };
	}

	componentDidMount() {
		this.init();
	}

	init = async () => {
		await gameService.init();
	}

	render() {
		return <div style={styles.container}>
			<div style={styles.buttons}>
				<Button onClick={this.startAlgorithm}>Start</Button>
				<Button onClick={this.stopAlgorithm}>Stop</Button>
			</div>
			<div style={styles.content}>
				<canvas width={1012} height={750} />
				<div style={styles.statistics}>
					<Statistic title="Generation" value={this.state.generation}/>
					<Statistic title="Fitness" value={Math.floor(this.state.fitness * 100) / 100}/>
					<Statistic title="Time" value={this.state.raceTime}/>
				</div>
			</div>
			<div style={styles.export}>
				<Button onClick={this.downloadBestBrain}>Exporter le champion</Button>
			</div>
		</div>;
	}

	startAlgorithm = () => {
		gameService.start(((gameState) => {
			this.setState({
				generation: gameState.generation,
				fitness: gameState.fitness,
				raceTime: gameState.raceTime,
				bestBrain: gameState.bestBrain
			});
		}));
	}

	stopAlgorithm = () => {
		console.log("stop");
	}

	downloadBestBrain = () => {
		if (this.state.bestBrain) {
			const brain = JSON.stringify(Network.toJson(this.state.bestBrain), null, "\t");
			const element = document.createElement("a");
			const file = new Blob([brain], {type: "application/json"});
			element.href = URL.createObjectURL(file);
			element.download = `brain.json`;
			element.click();
		}
	}
}

const styles: CssStyleSheet = {
	container: {
		maxWidth: "1200px",
		flexDirection: "column",
		alignItems: "center"
	},
	content: {
		display: "flex",
		flexDirection: "row"
	},
	buttons: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: "10px"
	},
	statistics: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
		padding: "0 10px"
	},
	export: {
		marginTop: 20,
		display: "flex",
		justifyContent: "center"
	}
};
