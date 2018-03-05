import { Activation } from "./methods";

export interface NeuronOptions {
	weights?: number[];
	activationFunction?: (x: number) => number;
	inputsSize?: number;
}

export class Neuron {
	weights: number[];
	private activationFunction: (x: number) => number;

	constructor(options: NeuronOptions = {}) {
		this.weights = options.weights || [];
		this.activationFunction = options.activationFunction || Activation.SIGMOID;
		if (options.inputsSize) {
			if (options.weights) {
				throw Error("Neuron constructor should be called with either a weight array OR with an input size");
			}
			for (let i = 0; i < options.inputsSize; i++) {
				this.setWeight(i, Math.random() * 2 - 1);
			}
		}
	}

	activate = (inputs: number[]): number => {
		if (inputs.length !== this.weights.length) {
			throw Error(`expecting an input array of length ${this.weights.length} but array length is ${inputs.length}`);
		}
		const untransferedOutput = inputs.reduce((acc, input, i) => {
			return acc + input * this.weights[i];
		});
		return this.activationFunction(untransferedOutput);
	}

	setWeight = (index: number, weight: number) => {
		this.weights[index] = weight;
	}
}
