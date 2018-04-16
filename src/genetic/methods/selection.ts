import { Candidate } from "../model/candidate";
import { Population } from "../model/population";

export class Selection {
	static RANK = (selectedCandidatesNumber?: number) => <T>(candidates: Candidate<T>[]): Candidate<T>[] => {
		const selectedCandidatesSize = selectedCandidatesNumber || Math.floor(candidates.length * 0.8);
		/**
		 * Sort candidates in ascending fitness order
		 */
		const sortedCandidates = candidates.sort((a, b) => a.fitness(a.genes) - b.fitness(b.genes));
		const selectedCandidates: Candidate<T>[] = [];
		const candidatesSize = sortedCandidates.length;
		for (let i = 0; i < selectedCandidatesSize; i++) {
			const pDomain = candidatesSize * (candidatesSize + 1) / 2;
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
	}

}
