import { Gene } from "./gene";

interface CandidateOptions<T> {
	fitness: (genes: T[]) => number;
	mutate: (genes: T[]) => T[];
	crossProbability?: number;
	mutationProbability?: number;
}

export class Candidate<T extends Gene> {
	genes: T[];
	fitness: (genes: T[]) => number;
	mutate: (genes: T[]) => T[];
	crossProbability: number;
	mutationProbability: number;

	constructor(genes: T[], options: CandidateOptions<T>) {
		this.genes = genes;
		this.fitness = options.fitness;
		this.mutate = options.mutate;
		this.crossProbability = options.crossProbability || 0.8;
		this.mutationProbability = options.mutationProbability || 0.2;
	}

	cross = (other: Candidate<T>) => {
		let firstChildGenes: T[] = [];
		let secondChildGenes: T[] = [];
		/**
		 * Cross the two parents genes according to the cross probability
		 */
		for (let i = 0; i < this.genes.length ; i++) {
			firstChildGenes.push(Math.random() < this.crossProbability ? this.genes[i] : other.genes[i]);
			secondChildGenes.push(Math.random() < this.crossProbability ? other.genes[i] : this.genes[i]);
		}

		/**
		 * Each child may mutate according to the mutation probability
		 */
		if (Math.random() < this.mutationProbability) {
			firstChildGenes = this.mutate(firstChildGenes);
		}
		if (Math.random() < this.mutationProbability) {
			secondChildGenes = this.mutate(secondChildGenes);
		}

		return [
			new Candidate(firstChildGenes, this.getOptions()),
			new Candidate(secondChildGenes, this.getOptions())
		];
	}

	getOptions = (): CandidateOptions<T> => {
		return {
			fitness: this.fitness,
			mutate: this.mutate,
			crossProbability: this.crossProbability,
			mutationProbability: this.mutationProbability
		};
	}
}
