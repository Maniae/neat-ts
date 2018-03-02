import { Candidate } from "../model/candidate";
import { Population } from "../model/population";

export class Selection {
	static RANK = <T>(candidates: Candidate<T>[]): Candidate<T>[] => {
		return candidates;
	}

}
