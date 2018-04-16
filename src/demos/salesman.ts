import { Selection } from "../genetic/methods";
import { Candidate, Population } from "../genetic/model";

export interface Position {
	x: number;
	y: number;
}

export function salesman(towns: Position[]) {

	const fitness = (genes: number[]) => {
		const totalDistance = genes.reduce((acc, gene, index) => {
			if (index === 0) {
				return 0;
			}
			return acc + distance(towns[gene], towns[genes[index - 1]]);
		});
		return 1 / totalDistance;
	};

	const mutate = (genes: number[]) => {
		const genesCopy = genes.slice();
		const mutatedIndex1 = Math.floor(Math.random() * genes.length);
		const mutatedIndex2 = Math.floor(Math.random() * genes.length);
		[genesCopy[mutatedIndex1], genesCopy[mutatedIndex2]] = [genesCopy[mutatedIndex2], genesCopy[mutatedIndex1]];
		return genesCopy;
	};

	const cross = (motherGenes: number[], fatherGenes: number[]) => {
		const startPos = 0;
	}

	let pop = Population.generatePopulation(
		20,
		createRandomGenotype,
		{
			fitness,
			mutate,
			cross,
			mutationProbability: 0.4
		}
	);

	for (let i = 0; i < 40; i++) {
		document.getElementById("main")!.innerHTML
			+= ("<br/><br />" + pop.candidates[0].genes + ", fitness: " + pop.candidates[0].fitness(pop.candidates[0].genes));
		pop = pop.createNextGeneration();
	}

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
