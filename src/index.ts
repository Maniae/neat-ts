import { Population } from "./genetic/model";
import { Network } from "./neural-network/network";

const initialPop = Population.generatePopulation<number>(
	30,
	generateRandomNumbers,
	{
		fitness: genes => genes.reduce((acc, gene) => acc + gene),
		mutate: mutateNumbers
	}
);

let pop = initialPop;
for (let i = 0; i < 50; i ++) {
	document.getElementById("main")!.innerHTML
		+= ("<br/><br />" + JSON.stringify(pop.candidates.map(it => [it.genes, it.fitness(it.genes)])));
	pop = pop.createNextGeneration();
}

function generateRandomNumbers() {
	const numbers = [];
	for (let i = 0; i < 10; i++) {
		numbers.push(Math.floor(Math.random() * 10));
	}
	return numbers;
}

function mutateNumbers(numbers: number[]) {
	const genes = numbers.slice();
	const indexMutated = Math.floor(Math.random() * genes.length);
	genes[indexMutated] = Math.floor(Math.random() * 10);
	return genes;
}
