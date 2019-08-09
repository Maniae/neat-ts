import { Crossover, Selection } from "../methods";
import { Candidate } from "./candidate";
import { FitnessFunction } from "./fitnessFunction";

interface PopulationOptions<T> {
	select?: (candidates: Candidate<T>[], fitness: FitnessFunction<T>) => Candidate<T>[];
	fitness?: FitnessFunction<T>;
	mutate?: (genes: T[]) => T[];
	cross?: (motherGenes: T[], fatherGenes: T[]) => T[][];
	mutationProbability?: number;
}
export class Population<T> {
	candidates: Candidate<T>[];
	select: (candidates: Candidate<T>[], fitness: FitnessFunction<T>) => Candidate<T>[];
	fitness: FitnessFunction<T>;
	mutate: (genes: T[]) => T[];
	cross: (motherGenes: T[], fatherGenes: T[]) => T[][];
	mutationProbability: number;

	constructor(candidates: Candidate<T>[], options: PopulationOptions<T> = {}) {
		this.candidates = candidates;
		this.select = options.select || Selection.RANK();
		this.fitness = options.fitness || (() => 0);
		this.mutate = options.mutate || (g => g);
		this.cross = options.cross || Crossover.SINGLE_POINT();
		this.mutationProbability = options.mutationProbability || 0.2;

		this.candidates.sort((a, b) => this.fitness(b) - this.fitness(a));
	}

	get bestCandidate(): Candidate<T> {
		return this.candidates[0];
	}

	get bestFitness(): number {
		return this.fitness(this.bestCandidate);
	}

	createNextGeneration(): Population<T> {
		/**
		 * Select stronger candidates
		 */
		const selectedCandidates = this.select(this.candidates, this.fitness);
		/**
		 * Cross stronger candidates and mutates their children
		 */

		const newCandidates = this.crossCandidates(selectedCandidates);

		/**
		 * Add the children to the population
		 */

		/**
		 * Keep the stronger candidates
		 */

		const bestElders = this.candidates
			.sort((a, b) => this.fitness(b) - this.fitness(a))
			.slice(0, this.candidates.length - newCandidates.length);

		const newPopulation = newCandidates.concat(bestElders);

		return new Population(newPopulation, this.getOptions());
	}

	crossCandidates(candidates: Candidate<T>[]): Candidate<T>[] {
		if (candidates.length % 2 !== 0) {
			throw Error("Selection size should be a multiple of 2");
		}
		const children: Candidate<T>[] = [];
		for (let i = 0; i < candidates.length; i += 2) {
			let [firstChildGenes, secondChildGenes] = this.cross(candidates[i].genes, candidates[i + 1].genes);
			if (Math.random() < this.mutationProbability) {
				firstChildGenes = this.mutate(firstChildGenes);
			}
			if (Math.random() < this.mutationProbability) {
				secondChildGenes = this.mutate(secondChildGenes);
			}
			children.push(new Candidate(firstChildGenes));
			children.push(new Candidate(secondChildGenes));
		}
		return children;
	}

	getOptions(): PopulationOptions<T> {
		return {
			fitness: this.fitness,
			mutate: this.mutate,
			select: this.select,
			cross: this.cross,
			mutationProbability: this.mutationProbability,
		};
	}

	/**
	 * Generate a new randomized population
	 * @param size The size of the population
	 * @param geneGenerator a function generating a random set of genes
	 * @param options Population options parameter
	 */
	static generatePopulation<T>(size: number, geneGenerator: () => T[], options: PopulationOptions<T>) {
		const candidates = [];
		for (let i = 0; i < size; i++) {
			candidates.push(new Candidate(geneGenerator()));
		}
		return new Population(candidates, options);
	}
}
