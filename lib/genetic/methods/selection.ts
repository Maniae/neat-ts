import { Candidate } from "../model/candidate";
import { FitnessFunction } from "../model/fitnessFunction";

export class Selection {
	static RANK = (selectedCandidatesNumber?: number) => <T>(
		candidates: Candidate<T>[],
		fitness: FitnessFunction<T>
	): Candidate<T>[] => {
		const selectedCandidatesSize = selectedCandidatesNumber || Math.floor(candidates.length * 0.8);
		/**
		 * Sort candidates in ascending fitness order
		 */
		const sortedCandidates = candidates.sort((a, b) => fitness(a) - fitness(b));
		const selectedCandidates: Candidate<T>[] = [];
		const candidatesSize = sortedCandidates.length;
		for (let i = 0; i < selectedCandidatesSize; i++) {
			const pDomain = (candidatesSize * (candidatesSize + 1)) / 2;
			const p = Math.floor(Math.random() * pDomain);
			let bornSup = 1;
			for (let j = 1; j <= candidatesSize; j++) {
				if (p < bornSup) {
					selectedCandidates.push(sortedCandidates[j - 1]);
					break;
				}
				bornSup += j + 1;
			}
		}
		return selectedCandidates;
	};
}
