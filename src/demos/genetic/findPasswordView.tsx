import * as React from "react";
import { Population } from "../../genetic/model";
import { Button } from "../common/button";
import { CssStyleSheet } from "../common/cssStyleSheet";
import { Statistic } from "../common/statistic";

interface FindPasswordViewState {
	currentPassword: string;
	fitness: number;
	population: Population<string>;
	running: boolean;
	generation: number;
}
export class FindPasswordView extends React.Component<{}, FindPasswordViewState> {

	private fitness: (pass: string) => (genes: string[]) => number = () => () => 0;
	private mutate: (pass: string) => (genes: string[]) => string[] = () => () => [];
	private generateRandomGenes: (pass: string) => () => string[] = () => () => [];

	constructor(props: {}) {
		super(props);
		this.state = { currentPassword: "password", fitness: 0, population: new Population([]), running: false, generation: 0 };
	}

	componentDidMount() {
		this.init();
	}

	init = () => {
		this.fitness = (pass: string) => (genes: string[]) => {
			const passwordArray = pass.split("");
			if (genes.length !== pass.length) {
				throw Error("passwords length not matching");
			}
			let score = 0;
			for (let i = 0; i < genes.length; i++) {
				if (genes[i] === passwordArray[i]) {
					score += 1;
				}
			}
			return score * 100 / pass.length;
		};

		this.mutate = (pass: string) => (genes: string[]) => {
			const genesCopy = genes.slice();
			const mutatedIndex = Math.floor(Math.random() * pass.length);
			genesCopy[mutatedIndex] = getRandomLetter();
			return genesCopy;
		};

		this.generateRandomGenes = (pass: string) => () => {
			const genes = [];
			for (let i = 0; i < pass.length; i++) {
				genes.push(getRandomLetter());
			}
			return genes;
		};
	}

	render() {
		return <div style={styles.container}>
			<div style={styles.buttons}>
				<Button onClick={this.startAlgorithm}>Start</Button>
				<Button onClick={this.stopAlgorithm}>Stop</Button>
			</div>
			<div style={styles.password}>
				{this.state.currentPassword}
			</div>
			<div style={styles.statistics}>
				<Statistic style={{marginLeft: 30}} title="Generation" value={this.state.generation}/>
				<Statistic title="Fitness" value={Math.floor(this.state.fitness * 100) / 100}/>
			</div>
		</div>;
	}

	startAlgorithm = () => {
		const randomPassowrd = "supermotdepasseimpossibleadeviner";

		const population = Population.generatePopulation(
			100,
			this.generateRandomGenes(randomPassowrd),
			{
				fitness: this.fitness(randomPassowrd),
				mutate: this.mutate(randomPassowrd),
				mutationProbability: 0.1
			}
		);

		this.setState({ population, running: true, generation: 0}, () => {
			requestAnimationFrame(this.run);
		});
	}

	stopAlgorithm = () => {
		this.setState({ running: false });
	}

	run = () => {
		this.setState(state => {
			const newPopulation = state.population.createNextGeneration();
			newPopulation.candidates.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes));
			const password = newPopulation.candidates[0].genes;
			const fitness = newPopulation.candidates[0].fitness(password);
			return {
				population: newPopulation,
				fitness,
				currentPassword: password.join(""),
				generation: state.generation + 1
			};
		});
		if (this.state.running) {
			requestAnimationFrame(this.run);
		}
	}
}

const styles: CssStyleSheet = {
	container: {
		flex: 1,
		maxWidth: "600px"
	},
	password: {
		margin: "20px",
		display: "flex",
		justifyContent: "center",
		padding: "10px"
	},
	buttons: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around"
	},
	statistics: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around"
	}
};

function getRandomLetter() {
	return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}
