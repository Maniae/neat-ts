import { Activation } from "../methods";
import { Layer } from "./layer";
import { Neuron } from "./neuron";

interface NetworkOptions {
	layers: Layer[];
}
export class Network {
	layers: Layer[];

	static perceptron(layersSizes: number[], activationFunction?: (x: number) => number) {
		return new Network({
			layers: layersSizes.reduce((layers: Layer[], size, index: number) => {
				layers.push(new Layer({
					size,
					isInputLayer: index === 0,
					inputsSize: index > 0 ? layers[index - 1].size : undefined,
					activationFunction: index > 0 ? activationFunction : Activation.LINEAR
				}));
				return layers;
			}, [])
		});
	}

	static fromWeights(weights: number[], layersSizes: number[], activationFunction?: (x: number) => number) {
		let weightIndex = layersSizes[0];
		const layers = [];
		layers.push(new Layer({
			isInputLayer: true,
			size: layersSizes[0]
		}));
		for (let i = 1; i < layersSizes.length; i++) {
			const neurons = [];
			for (let j = 0; j < layersSizes[i]; j++) {
				neurons.push(new Neuron({
					weights: weights.slice(weightIndex, weightIndex + layersSizes[i - 1] + 1),
					activationFunction
				}));
				weightIndex += (layersSizes[i - 1] + 1);
			}
			layers.push(new Layer({ neurons }));
		}
		return new Network({ layers });
	}

	constructor(options: NetworkOptions) {
		this.layers = options.layers || [];
	}

	get weights(): number[] {
		return this.layers.reduce(
			(layAcc: number[], layer) => layAcc.concat(
				layer.neurons.reduce((neuronAcc: number[], neuron) => neuronAcc.concat(neuron.weights), [])),
				[]);
	}

	activate = (inputs: number[]): number[] => {
		if (inputs.length !== this.layers[0].size) {
			throw Error(`Network inputs length should match first layer size, expected ${this.layers[0].size} but got ${inputs.length}`);
		}
		return this.layers.reduce((prevOutput: number[], layer) => layer.activate(prevOutput), inputs);
	}

	static toJson(network: Network) {
		return {
			weights: network.weights,
			layersSizes: network.layers.map(it => it.neurons.length)
		};
	}

	static fromJson(json: any) {
		return Network.fromWeights(
			json.weights,
			json.layersSizes
		);
	}
}
