import { Selection } from "../methods";
import { Candidate } from "./candidate";
import { Gene } from "./gene";

interface PopulationOptions<T> {
	fitness?: (candidates: Candidate<T>[]) => number;
	select: (candidates: Candidate<T>[]) => Candidate<T>[];
}

export class Population<T extends Gene> {
	candidates: Candidate<T>[];
	fitness: (candidates: Candidate<T>[]) => number;
	select: (candidates: Candidate<T>[]) => Candidate<T>[];

	constructor(candidates: Candidate<T>[], options: PopulationOptions<T>) {
		this.candidates = candidates;
		this.fitness = options.fitness || (x => 0);
		this.select = options.select || Selection.RANK;
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

		return new Population(selectedCandidates.concat(newCandidates), this.getOptions());
	}

	cross = (candidates: Candidate<T>[]): Candidate<T>[] => {
		if (candidates.length % 2 !== 0) {
			throw Error("Selection size should be a multiple of 2");
		}
		const children: Candidate<T>[] = [];
		for (let i = 0; i < candidates.length; i += 2) {
			children.concat(candidates[i].cross(candidates[i + 1]));
		}
		return children;
	}

	getOptions = (): PopulationOptions<T> => {
		return {
			fitness: this.fitness,
			select: this.select
		};
	}
}
