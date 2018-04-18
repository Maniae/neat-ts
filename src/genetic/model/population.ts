import { Selection } from "../methods";
import { Crossover } from "../methods/crossover";
import { Candidate } from "./candidate";

interface PopulationOptions<T> {
	select?: (candidates: Candidate<T>[]) => Candidate<T>[];
	fitness?: (genes: T[]) => number;
	mutate?: (genes: T[]) => T[];
	cross?: (motherGenes: T[], fatherGenes: T[]) => T[][];
	mutationProbability?: number;
	ellitism?: boolean;
}

export class Population<T> {
	candidates: Candidate<T>[];
	select: (candidates: Candidate<T>[]) => Candidate<T>[];
	fitness: (genes: T[]) => number;
	mutate: (genes: T[]) => T[];
	cross: (motherGenes: T[], fatherGenes: T[]) => T[][];
	mutationProbability: number;
	ellitism: boolean;

	/**
	 * Generate a new randomized population
	 * @param size The size of the population
	 * @param geneGenerator a function generating a random set of genes
	 * @param options Population options parameter
	 */
	static generatePopulation<T>(size: number, geneGenerator: () => T[], options: PopulationOptions<T>) {
		const candidates = [];
		const { fitness, mutate, mutationProbability } = options;
		for (let i = 0; i < size; i++) {
			candidates.push(new Candidate(geneGenerator(), {
				fitness: fitness || (() => 0)
			}));
		}
		return new Population(candidates, options);
	}

	constructor(candidates: Candidate<T>[], options: PopulationOptions<T> = {}) {
		this.candidates = candidates;
		this.select = options.select || Selection.RANK();
		this.fitness = options.fitness || (() => 0);
		this.mutate = options.mutate || (g => g);
		this.ellitism = options.ellitism || false;
		this.cross = options.cross || Crossover.SINGLE_POINT();
		this.mutationProbability = options.mutationProbability || 0.2;
	}

	createNextGeneration = (): Population<T> => {
		/**
		 * Select stronger candidates
		 */
		const selectedCandidates = this.select(this.candidates);

		/**
		 * Cross stronger candidates and mutates their children
		 */
		const newCandidates = this.crossCandidates(selectedCandidates);
		/**
		 * Add the children to the population
		 */
		const newGeneration = this.candidates.concat(newCandidates);

		/**
		 * Keep the stronger candidates
		 */
		const cleanedNewGeneration = newGeneration
			.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes))
			.slice(0, this.candidates.length - +this.ellitism);

		if (this.ellitism) {
			// Keep the best oldest candidate
			cleanedNewGeneration.push(
				this.candidates.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes))[this.candidates.length - 1]
			);
		}

		return new Population(cleanedNewGeneration, this.getOptions());
	}

	crossCandidates = (candidates: Candidate<T>[]): Candidate<T>[] => {
		if (candidates.length % 2 !== 0) {
			throw Error("Selection size should be a multiple of 2");
		}
		const children: Candidate<T>[] = [];
		const options = candidates[0].getOptions();
		for (let i = 0; i < candidates.length; i += 2) {
			let [firstChildGenes, secondChildGenes] = this.cross(candidates[i].genes, candidates[i + 1].genes);
			if (Math.random() < this.mutationProbability) {
				firstChildGenes = this.mutate(firstChildGenes);
			}
			if (Math.random() < this.mutationProbability) {
				secondChildGenes = this.mutate(secondChildGenes);
			}
			children.push(new Candidate(firstChildGenes, options));
			children.push(new Candidate(secondChildGenes, options));
		}
		return children;
	}

	getOptions = (): PopulationOptions<T> => {
		return {
			fitness: this.fitness,
			mutate: this.mutate,
			select: this.select,
			cross: this.cross,
			mutationProbability: this.mutationProbability,
			ellitism: this.ellitism
		};
	}
}
