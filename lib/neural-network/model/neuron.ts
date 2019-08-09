export type ActivationFunction = (x: number) => number;

export class Neuron {
	weights: number[];
	activationFunction: ActivationFunction;
	bias: number;

	constructor(weights: number[], bias: number, activationFunction: ActivationFunction) {
		if (weights.length < 1) {
			throw Error("Expecting at least one weight for the neuron");
		}
		weights.forEach(w => {
			if (w > 1 || w < -1) {
				throw Error(`Weight value should be between -1 and 1, got ${w}`);
			}
		});
		if (bias > 1 || bias < -1) {
			throw Error(`bias value should be between -1 and 1, got ${bias}`);
		}
		this.weights = weights;
		this.bias = bias;
		this.activationFunction = activationFunction;
	}

	get inputSize(): number {
		return this.weights.length;
	}

	activate(inputs: number[]): number {
		if (inputs.length !== this.weights.length) {
			throw Error(`expecting an input array of length ${this.weights.length} but array length is ${inputs.length}`);
		}

		const untransferedOutput = inputs.reduce((acc, input, i) => {
			return acc + input * this.weights[i];
		}, 0);
		return this.activationFunction(untransferedOutput + this.bias);
	}

	setWeight(index: number, weight: number) {
		this.weights[index] = weight;
	}

	static randomized(inputSize: number, activationFunction: ActivationFunction) {
		const inputs = [];
		for (let i = 0; i < inputSize; i++) {
			inputs.push(Math.random() * 2 - 1);
		}
		return new Neuron(inputs, Math.random() * 2 - 1, activationFunction);
	}
}
