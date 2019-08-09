export class Crossover {
	static SINGLE_POINT = (crossProbability: number = 0.8) => <T>(motherGenes: T[], fatherGenes: T[]) => {
		const firstChildGenes: T[] = [];
		const secondChildGenes: T[] = [];
		/**
		 * Cross the two parents genes according to the cross probability
		 */
		for (let i = 0; i < motherGenes.length; i++) {
			firstChildGenes.push(Math.random() < crossProbability ? motherGenes[i] : fatherGenes[i]);
			secondChildGenes.push(Math.random() < crossProbability ? fatherGenes[i] : motherGenes[i]);
		}

		return [firstChildGenes, secondChildGenes];
	};
}
