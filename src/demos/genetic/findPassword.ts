import { Selection } from "../../genetic/methods";
import { Candidate, Population } from "../../genetic/model";

export function findPassword(password: string) {

	const fitness = (pass: string) => (genes: string[]) => {
		const passwordArray = pass.split("");
		if (genes.length !== pass.length) {
			throw Error("passwords length not matching");
		}
		let score = 0;
		for (let i = 0; i < genes.length; i++) {
			if (genes[i] === passwordArray[i]) {
				score += 1;
			}
		}
		return score * 100 / pass.length;
	};

	const mutate = (pass: string) => (genes: string[]) => {
		const genesCopy = genes.slice();
		const mutatedIndex = Math.floor(Math.random() * pass.length);
		genesCopy[mutatedIndex] = getRandomLetter();
		return genesCopy;
	};

	const generateRandomGenes = (pass: string) => () => {
		const genes = [];
		for (let i = 0; i < pass.length; i++) {
			genes.push(getRandomLetter());
		}
		return genes;
	};

	let pop = Population.generatePopulation(
		100,
		generateRandomGenes(password),
		{
			fitness: fitness(password),
			mutate: mutate(password),
			mutationProbability: 0.4
		}
	);

	for (let i = 0; i < 100; i++) {
		document.getElementById("main")!.innerHTML
			+= ("<br/><br />" + pop.candidates[0].genes + ", fitness: " + pop.candidates[0].fitness(pop.candidates[0].genes));
		pop = pop.createNextGeneration();
	}

	function getRandomLetter() {
		return String.fromCharCode(97 + Math.floor(Math.random() * 26));
	}
}
