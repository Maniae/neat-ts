import { Layer } from "./layer";
import { ActivationFunction, Neuron } from "./neuron";

export class Network {
	layers: Layer[];
	constructor(layers: Layer[]) {
		this.layers = layers;
	}

	activate(inputs: number[]) {
		if (inputs.length !== this.layers[0].size) {
			throw Error(
				`Network inputs length should match first layer size, expected ${this.layers[0].size} but got ${inputs.length}`
			);
		}
		return this.layers.reduce((prevOutput: number[], layer, i) => layer.activate(prevOutput, i === 0), inputs);
	}

	static fromWeights(
		weights: number[],
		biases: number[],
		layersSizes: number[],
		activationFunction: ActivationFunction
	): Network {
		let weightIndex = 0;
		let neuronCount = 0;
		const layers = [];
		for (let i = 0; i < layersSizes.length; i++) {
			const neurons = [];
			const inputSize = i === 0 ? 1 : layersSizes[i - 1];
			for (let j = 0; j < layersSizes[i]; j++) {
				neurons.push(
					new Neuron(weights.slice(weightIndex, weightIndex + inputSize), biases[neuronCount], activationFunction)
				);
				weightIndex += inputSize;
				neuronCount++;
			}
			layers.push(new Layer(neurons));
		}
		return new Network(layers);
	}

	get weights(): number[] {
		return this.layers.reduce(
			(layAcc: number[], layer) =>
				layAcc.concat(layer.neurons.reduce((neuronAcc: number[], neuron) => neuronAcc.concat(neuron.weights), [])),
			[]
		);
	}

	get biases(): number[] {
		return this.layers.reduce((acc: number[], layer) => acc.concat(layer.neurons.map(n => n.bias)), []);
	}

	static toJson(network: Network) {
		return {
			weights: network.weights,
			biases: network.biases,
			layersSizes: network.layers.map(it => it.neurons.length),
		};
	}

	static fromJson(json: NetworkJson, activationFunction: ActivationFunction) {
		return Network.fromWeights(json.weights, json.biases, json.layersSizes, activationFunction);
	}

	static randomized(layersSizes: number[], activationFunction: ActivationFunction) {
		return new Network(
			layersSizes.reduce((acc: Layer[], size, i) => {
				const inputSize = layersSizes[i - 1] || 1;
				acc.push(Layer.randomized(size, inputSize, activationFunction));
				return acc;
			}, [])
		);
	}
}

export interface NetworkJson {
	weights: number[];
	biases: number[];
	layersSizes: number[];
}
