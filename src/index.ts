import { Candidate, Population } from "./genetic/model";
import { Network } from "./neural-network/network";

// const nn = Network.perceptron([2, 4, 3, 1]);

// const genes = nn.weights;

// document.getElementById("main")!.innerHTML = "" + nn.activate([0, 1]);

const fitness = (nn: Network) => () => {
	// console.log("FITNESS");
	const xorFF = nn.activate([0, 0])[0];
	// console.log(xorFF);
	const xorFT = nn.activate([0, 1])[0];
	// console.log(xorFT);
	const xorTF = nn.activate([1, 0])[0];
	// console.log(xorTF);
	const xorTT = nn.activate([1, 1])[0];
	// console.log(xorTT);
	console.log(nn);
	return Math.pow(1 - xorFF + xorFT + xorTF + 1 - xorTT, 16);
};

function mutate(weights: number[]) {
	const weightsCopy = weights.slice();
	const indexMutated = Math.floor(Math.random() * weightsCopy.length);
	weightsCopy[indexMutated] = Math.random() * 2 - 1;
	return weightsCopy;
}

// Create the networks
const candidates = [];

for (let i = 0; i < 3; i ++) {
	const nn = Network.perceptron([2, 4, 3, 1]);
	const candidate = new Candidate(nn.weights, {
		fitness: fitness(nn),
		mutate
	});
	candidates.push(candidate);
}

const initialPop = new Population(candidates);

let pop = initialPop;

for (let i = 0; i < 50; i ++) {
	document.getElementById("main")!.innerHTML
		+= ("<br/><br />" + pop.candidates[0].fitness([]));
	pop = pop.createNextGeneration();
}

// document.getElementById("main")!.innerHTML = "" + nn.weights;

// const initialPop = Population.generatePopulation<number>(
// 	30,
// 	generateRandomNumbers,
// 	{
// 		fitness: genes => genes.reduce((acc, gene) => acc + gene),
// 		mutate: mutateNumbers
// 	}
// );

// let pop = initialPop;
// for (let i = 0; i < 50; i ++) {
// 	document.getElementById("main")!.innerHTML
// 		+= ("<br/><br />" + JSON.stringify(pop.candidates.map(it => [it.genes, it.fitness(it.genes)])));
// 	pop = pop.createNextGeneration();
// }

// function generateRandomNumbers() {
// 	const numbers = [];
// 	for (let i = 0; i < 10; i++) {
// 		numbers.push(Math.floor(Math.random() * 10));
// 	}
// 	return numbers;
// }

// function mutateNumbers(numbers: number[]) {
// 	const genes = numbers.slice();
// 	const indexMutated = Math.floor(Math.random() * genes.length);
// 	genes[indexMutated] = Math.floor(Math.random() * 10);
// 	return genes;
// }
