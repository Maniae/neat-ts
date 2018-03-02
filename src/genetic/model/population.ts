import { Selection } from "../methods";
import { Candidate } from "./candidate";
import { Gene } from "./gene";

interface PopulationOptions<T> {
	select?: (candidates: Candidate<T>[]) => Candidate<T>[];
	fitness: (genes: T[]) => number;
	mutate: (genes: T[]) => T[];
	mutationProbability?: number;
	crossProbability?: number;
}

export class Population<T extends Gene> {
	candidates: Candidate<T>[];
	select: (candidates: Candidate<T>[]) => Candidate<T>[];
	fitness: (genes: T[]) => number;
	mutate: (genes: T[]) => T[];
	mutationProbability?: number;
	crossProbability?: number;

	/**
	 * Generate a new randomized population
	 * @param size The size of the population
	 * @param geneGenerator a function generating a random set of genes
	 * @param options Population options parameter
	 */
	static generatePopulation<T>(size: number, geneGenerator: () => T[], options: PopulationOptions<T>) {
		const candidates = [];
		const { fitness, mutate, mutationProbability, crossProbability } = options;
		for (let i = 0; i < size; i++) {
			candidates.push(new Candidate(geneGenerator(), options));
		}
		return new Population(candidates, options);
	}

	constructor(candidates: Candidate<T>[], options: PopulationOptions<T>) {
		this.candidates = candidates;
		this.select = options.select || Selection.RANK();
		this.fitness = options.fitness || Selection.RANK();
		this.mutate = options.mutate || Selection.RANK();
	}

	createNextGeneration = (): Population<T> => {
		/**
		 * Select stronger candidates
		 */
		const selectedCandidates = this.select(this.candidates);

		/**
		 * Cross stronger candidates and mutates their children
		 */
		const newCandidates = this.cross(selectedCandidates);

		/**
		 * Add the children to the population
		 */
		const newGeneration = this.candidates.concat(newCandidates);

		/**
		 * Keep the stronger candidates
		 */
		const cleanedNewGeneration = newGeneration
			.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes))
			.slice(0, this.candidates.length);

		return new Population(cleanedNewGeneration, this.getOptions());
	}

	cross = (candidates: Candidate<T>[]): Candidate<T>[] => {
		if (candidates.length % 2 !== 0) {
			throw Error("Selection size should be a multiple of 2");
		}
		let children: Candidate<T>[] = [];
		for (let i = 0; i < candidates.length; i += 2) {
			const tChildren = candidates[i].cross(candidates[i + 1]);
			children = children.concat(tChildren);
		}
		return children;
	}

	getOptions = (): PopulationOptions<T> => {
		return {
			fitness: this.fitness,
			mutate: this.mutate,
			select: this.select,
			mutationProbability: this.mutationProbability,
			crossProbability: this.crossProbability
		};
	}
}
