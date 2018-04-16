import { Selection } from "./genetic/methods";
import { Candidate, Population } from "./genetic/model";

const PASSWORD = "hardcorepasswordmasterrace";
const fitness = (password: string) => (genes: string[]) => {
	const passwordArray = password.split("");
	if (genes.length !== password.length) {
		throw Error("passwords length not matching");
	}
	let score = 0;
	for (let i = 0; i < genes.length; i++) {
		if (genes[i] === passwordArray[i]) {
			score += 1;
		}
	}
	return score * 100 / password.length;
};

const mutate = (password: string) => (genes: string[]) => {
	const genesCopy = genes.slice();
	const mutatedIndex = Math.floor(Math.random() * PASSWORD.length);
	genesCopy[mutatedIndex] = getRandomLetter();
	return genesCopy;
};

// Create the networks
const candidates = [];

for (let i = 0; i < 100; i ++) {
	const genes = generateRandomGenes();
	const candidate = new Candidate<string>(
		generateRandomGenes(),
		{
			fitness: fitness(PASSWORD),
			mutate: mutate(PASSWORD),
			mutationProbability: 0.4
		}
	);
	candidates.push(candidate);
}

const initialPop = new Population(candidates);

let pop = initialPop;

for (let i = 0; i < 100; i ++) {
	document.getElementById("main")!.innerHTML
		+= ("<br/><br />" + pop.candidates[0].genes + ", fitness: " + pop.candidates[0].fitness(pop.candidates[0].genes));
	pop = pop.createNextGeneration();
}

function generateRandomGenes() {
	const genes = [];
	for (let i = 0; i < PASSWORD.length; i++) {
		genes.push(getRandomLetter());
	}
	return genes;
}

function getRandomLetter() {
	return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}
