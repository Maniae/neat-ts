import { Selection } from "../genetic/methods";
import { Candidate, Population } from "../genetic/model";

export interface Position {
	x: number;
	y: number;
}

const c = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d")!;

export function salesman(towns: Position[]) {

	const fitness = (genes: number[]) => {
		const totalDistance = genes.reduce((acc, gene, index) => {
			if (index === 0) {
				return 0;
			}
			return acc + distance(towns[gene], towns[genes[index - 1]]);
		});
		return 1000 / totalDistance;
	};

	const mutate = (genes: number[]) => {
		const genesCopy = genes.slice();
		const mutatedIndex1 = Math.floor(Math.random() * genes.length);
		const mutatedIndex2 = Math.floor(Math.random() * genes.length);
		[genesCopy[mutatedIndex1], genesCopy[mutatedIndex2]] = [genesCopy[mutatedIndex2], genesCopy[mutatedIndex1]];
		return genesCopy;
	};

	const cross = (motherGenes: number[], fatherGenes: number[]) => {
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

	let pop = Population.generatePopulation(
		200,
		createRandomGenotype,
		{
			fitness,
			mutate,
			cross,
			mutationProbability: 1
		}
	);

	const step = () => {
		drawSolution(towns, pop.candidates[0].genes);
		// pop.candidates.map(it => drawSolution(towns, it.genes));
		document.getElementById("score")!.innerHTML = "" + pop.candidates[0].fitness(pop.candidates[0].genes);
		pop = pop.createNextGeneration();
		requestAnimationFrame(step);
	};

	requestAnimationFrame(step);

	function createRandomGenotype() {
		const genotype = Array.from({length: towns.length}, (v, k) => k);
		shuffleArray(genotype);
		return genotype;
	}
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

function drawSolution(towns: Position[], genes: number[]) {
	const genesCopy = genes.slice(0);
	genesCopy.push(genes[0]);
	ctx.clearRect(0, 0, c.width, c.height);
	for (const town of towns) {
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.arc(c.width / 10 * town.x, c.height - (c.height / 10 * town.y), 5, 0, 2 * Math.PI);
		ctx.fill();
	}
	// ctx.strokeStyle = `rgb(
	// 	${Math.floor(Math.random() * 255)},
	// 	${Math.floor(Math.random() * 255)},
	// 	${Math.floor(Math.random() * 255)}
	// )`;
	ctx.moveTo(towns[genesCopy[0]].x, towns[genesCopy[0]].y);
	ctx.beginPath();
	for (const g of genesCopy) {
		ctx.lineTo(c.width / 10 * towns[g].x, c.height - (c.height / 10 * towns[g].y));
	}
	ctx.stroke();
}
