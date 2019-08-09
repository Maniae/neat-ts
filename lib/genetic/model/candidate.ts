export class Candidate<T> {
	genes: T[];
	fitness: number;

	constructor(genes: T[]) {
		this.genes = genes;
		this.fitness = 0;
	}
}
