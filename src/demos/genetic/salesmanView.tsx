import * as React from "react";
import { Population } from "../../genetic/model";
import { Button } from "../common/button";
import { CssStyleSheet } from "../common/cssStyleSheet";
import { Statistic } from "../common/statistic";

interface SalesmanViewState {
	fitness: number;
	population: Population<number>;
	running: boolean;
	generation: number;
}

const towns: Position[] = [
	{x: 1, y: 1},
	{x: 1, y: 2},
	{x: 1, y: 8},
	{x: 2, y: 6},
	{x: 3, y: 1},
	{x: 3, y: 4},
	{x: 3, y: 10},
	{x: 4, y: 9},
	{x: 5, y: 2},
	{x: 5, y: 6},
	{x: 5, y: 8},
	{x: 6, y: 4},
	{x: 7, y: 7},
	{x: 7, y: 9},
	{x: 8, y: 1},
	{x: 9, y: 3},
	{x: 9, y: 5},
	{x: 9, y: 10},
	{x: 10, y: 2},
	{x: 10, y: 8}
];

export class SalesmanView extends React.Component<{}, SalesmanViewState> {

	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private fitness: (genes: number[]) => number = () => 0;
	private mutate: (genes: number[]) => number[] = () => [];
	private generateRandomGenes: () => number[] = () => [];
	private cross: (motherGenes: number[], fatherGenes: number[]) => number[][] = () => [];

	constructor(props: {}) {
		super(props);
		this.state = { fitness: 0, population: new Population([]), running: false, generation: 0 };
	}

	componentDidMount() {
		this.init();
		this.drawTowns();
	}

	init = () => {
		this.fitness = (genes: number[]) => {
			const totalDistance = genes.reduce((acc, gene, index) => {
				if (index === 0) {
					return 0;
				}
				return acc + distance(towns[gene], towns[genes[index - 1]]);
			});
			return 1000 / totalDistance;
		};

		this.mutate = (genes: number[]) => {
			const genesCopy = genes.slice();
			const mutatedIndex1 = Math.floor(Math.random() * genes.length);
			const mutatedIndex2 = Math.floor(Math.random() * genes.length);
			[genesCopy[mutatedIndex1], genesCopy[mutatedIndex2]] = [genesCopy[mutatedIndex2], genesCopy[mutatedIndex1]];
			return genesCopy;
		};

		this.cross = (motherGenes: number[], fatherGenes: number[]) => {
			const genesLength = motherGenes.length;
			const endPos = Math.floor(genesLength * 0.8);
			const firstChildGenes = motherGenes.slice(0, endPos);
			const secondChildGenes = fatherGenes.slice(0, endPos);
			for (let i = 0; i < genesLength; i++) {
				if (firstChildGenes.indexOf(fatherGenes[i]) < 0) {
					firstChildGenes.push(fatherGenes[i]);
				}
				if (secondChildGenes.indexOf(motherGenes[i]) < 0) {
					secondChildGenes.push(motherGenes[i]);
				}
			}
			if (firstChildGenes.length !== genesLength || secondChildGenes.length !== genesLength) {
				throw Error("children length not matching parent's");
			}
			return [firstChildGenes, secondChildGenes];
		};

		this.generateRandomGenes = () => {
			const genotype = Array.from({length: towns.length}, (v, k) => k);
			shuffleArray(genotype);
			return genotype;
		};
	}

	render() {
		return <div style={styles.container}>
			<div style={styles.buttons}>
				<Button onClick={this.startAlgorithm}>Start</Button>
				<Button onClick={this.stopAlgorithm}>Stop</Button>
			</div>
			<canvas width={500} height={500} ref={this.storeCanvasContext}/>
			<div style={styles.statistics}>
				<Statistic style={{marginLeft: 30}} title="Generation" value={this.state.generation}/>
				<Statistic title="Fitness" value={Math.floor(this.state.fitness * 100) / 100}/>
			</div>
		</div>;
	}

	storeCanvasContext = (canvas: HTMLCanvasElement | null) => {
		this.canvas = canvas;
		if (canvas) {
			this.ctx = canvas.getContext("2d");
		}
	}

	startAlgorithm = () => {
		const randomPassowrd = "supermotdepasseimpossibleadeviner";

		const population = Population.generatePopulation(
			200,
			this.generateRandomGenes,
			{
				fitness: this.fitness,
				mutate: this.mutate,
				cross: this.cross,
				mutationProbability: 1
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
			const path = newPopulation.candidates[0].genes;
			const fitness = newPopulation.candidates[0].fitness(path);
			return {
				population: newPopulation,
				fitness,
				generation: state.generation + 1
			};
		}, this.drawSolution);
		if (this.state.running) {
			requestAnimationFrame(this.run);
		}
	}

	drawSolution = () => {
		if (!this.ctx || !this.canvas) {
			return;
		}
		const genes = this.state.population.candidates[0].genes;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const genesCopy = genes.slice(0);
		genesCopy.push(genes[0]);
		this.drawTowns();
		this.ctx.moveTo(towns[genesCopy[0]].x, towns[genesCopy[0]].y);
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#4285F4";
		for (const g of genesCopy) {
			this.ctx.lineTo(this.canvas.width / 11 * towns[g].x, this.canvas.height - (this.canvas.height / 11 * towns[g].y));
		}
		this.ctx.stroke();
	}

	drawTowns = () => {
		if (!this.ctx || !this.canvas) {
			return;
		}
		for (const town of towns) {
			this.ctx.beginPath();
			this.ctx.fillStyle = "blue";
			this.ctx.arc(this.canvas.width / 11 * town.x, this.canvas.height - (this.canvas.height / 11 * town.y), 5, 0, 2 * Math.PI);
			this.ctx.fill();
		}
	}
}

const styles: CssStyleSheet = {
	container: {
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

interface Position {
	x: number;
	y: number;
}

function distance(pos1: Position, pos2: Position) {
	return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
