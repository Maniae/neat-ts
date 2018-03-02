import { Gene } from "./gene";

export class Candidate<T extends Gene> {
	constructor(
		readonly genes: T[],
		readonly crossProbability: number,
		readonly fitness: (genes?: T[]) => number,
		readonly mutationProbability: number,
		readonly mutate: (genes: T[]) => T[]
	) {}

	cross = (other: Candidate<T>) => {
		const firstChildGenes: T[] = [];
		const secondChildGenes: T[] = [];
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
		for (const childGenes of [firstChildGenes, secondChildGenes]) {
			if (Math.random() < this.mutationProbability) {
				this.mutate(childGenes);
			}
		}

		return [
			new Candidate(firstChildGenes, this.crossProbability, this.fitness, this.mutationProbability, this.mutate),
			new Candidate(secondChildGenes, this.crossProbability, this.fitness, this.mutationProbability, this.mutate)
		];
	}
}
