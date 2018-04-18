
interface CandidateOptions<T> {
	fitness: (genes: T[]) => number;
}

export class Candidate<T> {
	genes: T[];
	fitness: (genes: T[]) => number;

	constructor(genes: T[], options: CandidateOptions<T>) {
		this.genes = genes;
		this.fitness = options.fitness;
	}

	getOptions = (): CandidateOptions<T> => {
		return {
			fitness: this.fitness
		};
	}
}
