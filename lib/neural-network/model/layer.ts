import { ActivationFunction, Neuron } from "./neuron";

export class Layer {
	neurons: Neuron[];

	constructor(neurons: Neuron[]) {
		this.neurons = neurons;
	}

	get size(): number {
		return this.neurons.length;
	}

	activate(inputs: number[], inputLayer?: boolean): number[] {
		if (inputLayer) {
			return this.neurons.map((n, i) => n.activate([inputs[i]]));
		}
		return this.neurons.map(n => n.activate(inputs));
	}

	static randomized(layerSize: number, inputSize: number, activationFunction: ActivationFunction) {
		const neurons = [];
		for (let i = 0; i < layerSize; i++) {
			neurons.push(Neuron.randomized(inputSize, activationFunction));
		}
		return new Layer(neurons);
	}
}
