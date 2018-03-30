import { Selection } from "./genetic/methods";
import { Candidate, Population } from "./genetic/model";
import { Network } from "./neural-network/network";

const fitness = (nn: Network) => () => {
	// console.log("FITNESS");
	// const xorFF = nn.activate([0, 0])[0];
	// const errFF = 1 / (1 - xorFF);
	// // console.log(xorFF);
	const xorFT = nn.activate([0, 1])[0];
	// const errFT = 1 / xorFT;
	// // console.log(xorFT);
	// const xorTF = nn.activate([1, 0])[0];
	// const errTF = 1 / xorFT;
	// // console.log(xorTF);
	// const xorTT = nn.activate([1, 1])[0];
	// const errTT = 1 / (1 - xorFF);
	// // console.log(xorTT);
	// // console.log(1 - xorFF + xorFT + xorTF + 1 - xorTT);
	// console.log(errFF, errFT, errTF, errTT);
	// return Math.pow(1 / (errFF + errFT + errTF + errTT), 2);
	return xorFT;
};

function mutate(weights: number[]) {
	const weightsCopy = weights.slice();
	const indexMutated = Math.floor(Math.random() * weightsCopy.length);
	weightsCopy[indexMutated] = Math.random() * 2 - 1;
	return weightsCopy;
}

// Create the networks
const candidates = [];

for (let i = 0; i < 20; i ++) {
	const nn = Network.perceptron([2, 4, 3, 1]);
	const candidate = new Candidate(nn.weights, {
		fitness: fitness(nn),
		mutate,
		mutationProbability: 1
	});
	candidates.push(candidate);
}

const initialPop = new Population(candidates);

let pop = initialPop;

for (let i = 0; i < 3; i ++) {
	if (true) {
		console.table(pop.candidates.map(it => it.fitness([])));
	}
	document.getElementById("main")!.innerHTML
		+= ("<br/><br />" + pop.candidates[0].fitness([]));
	pop = pop.createNextGeneration();
}
