import { Population } from "../../genetic/model";
import { Network } from "../../neural-network/model/network";

const layersSizes = [2, 3, 4, 1];
const WEIGHTS_SIZE = 2 + 3 * (2 + 1) + 4 * (3 + 1) + (4 + 1);

export function xor() {
	const fitness = (genes: number[]) => {
		const nn = Network.fromWeights(genes, layersSizes);
		const FF = nn.activate([0, 0])[0];
		const FT = nn.activate([0, 1])[0];
		const TF = nn.activate([1, 0])[0];
		const TT = nn.activate([1, 1])[0];

		const fit = 1 - ((FF * FF) + (1 - FT) * (1 - FT) + (1 - TF) * (1 - TF) + (TT * TT));

		return fit;
	};

	const mutate = (genes: number[]) => {
		const genesCopy = genes.slice(0);
		const randomIndex = Math.floor(Math.random() * genes.length);
		genesCopy[randomIndex] = Math.random() * 2 - 1;
		return genesCopy;
	};

	const generateRandomWeights = () => {
		return Network.perceptron([2, 3, 4, 1]).weights;
	};

	let pop = Population.generatePopulation(
		100,
		generateRandomWeights,
		{
			fitness,
			mutate,
			mutationProbability: 0.4
		}
	);

	let iterations = 0;

	const step = () => {
		iterations ++;
		const network = Network.fromWeights(pop.candidates[0].genes, layersSizes);
		document.getElementById("score")!.innerHTML = "fitness: " + crop(pop.candidates[0].fitness(pop.candidates[0].genes)) +
			"<br /> [0, 0]: " + crop(network.activate([0, 0])[0]) +
			"<br /> [0, 1]: " + crop(network.activate([0, 1])[0]) +
			"<br /> [1, 0]: " + crop(network.activate([1, 0])[0]) +
			"<br /> [1, 1]: " + crop(network.activate([1, 1])[0]) +
			"<br /> iterations: " + iterations;
		pop = pop.createNextGeneration();
		requestAnimationFrame(step);
	};

	requestAnimationFrame(step);

}

function crop(x: number) {
	return Math.floor(x * 100) / 100;
}
