import * as React from "react";
import { Button } from "../../common/button";
import { CssStyleSheet } from "../../common/cssStyleSheet";
import { Statistic } from "../../common/statistic";
import { gameService } from "./services";

interface RaceViewState {
	generation: number;
	fitness: number;
	raceTime: number;
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
					<Statistic style={{marginLeft: 30}} title="Generation" value={this.state.generation}/>
					<Statistic title="Fitness" value={Math.floor(this.state.fitness * 100) / 100}/>
					<Statistic title="Time" value={this.state.raceTime}/>
				</div>
			</div>
		</div>;
	}

	startAlgorithm = () => {
		// gameService.start();
		gameService.start(((gameState) => {
			this.setState({
				generation: gameState.generation,
				fitness: 0,
				raceTime: gameState.raceTime
			});
		}));
	}

	stopAlgorithm = () => {
		console.log("stop");
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
		justifyContent: "space-around"
	}
};
