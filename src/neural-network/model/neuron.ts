import { Activation } from "../methods";

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
		this.activationFunction = options.activationFunction || Activation.TANH;
		if (options.inputsSize) {
			if (options.weights) {
				throw Error("Neuron constructor should be called with either a weight array OR with an input size");
			}
			for (let i = 0; i < options.inputsSize + 1; i++) {
				this.setWeight(i, Math.random() * 2 - 1);
			}
		}
	}

	activate = (inputs: number[]): number => {
		if (inputs.length + 1 !== this.weights.length) {
			throw Error(`expecting an input array of length ${this.weights.length} but array length is ${inputs.length + 1}`);
		}
		const untransferedOutput = inputs.reduce((acc, input, i) => {
			return acc + input * this.weights[i];
		}, this.weights[this.weights.length - 1]);
		return this.activationFunction(untransferedOutput);
	}

	setWeight = (index: number, weight: number) => {
		this.weights[index] = weight;
	}
}
