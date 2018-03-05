import { Activation } from "./methods";
import { Neuron, NeuronOptions } from "./neuron";

interface LayerOptions {
	neurons?: Neuron[];
	size?: number;
	inputsSize?: number;
	isInputLayer?: boolean;
}
export class Layer {
	neurons: Neuron[];
	isInputLayer: boolean;

	constructor(options: LayerOptions = {}) {
		this.neurons = options.neurons || [];
		this.isInputLayer = options.isInputLayer || false;
		if (options.size) {
			if (this.neurons.length > 0) {
				throw Error("Layer constructor should be called either with a Neuron array OR with a layer size");
			}
			for (let i = 0; i < options.size; i++) {
				const neuronOptions: NeuronOptions = options.isInputLayer ? {weights: [1], activationFunction: Activation.LINEAR} : {};
				if (options.inputsSize) {
					if (options.isInputLayer) {
						throw Error("Can't specify neurons inputs size for an input layer");
					}
					neuronOptions.inputsSize = options.inputsSize;
				}
				this.neurons.push(new Neuron(neuronOptions));
			}
		}
	}

	get size(): number {
		return this.neurons.length;
	}

	activate = (inputs: number[]): number[] => {
		if (this.isInputLayer) {
			return inputs;
		}
		const outputs = [];
		for (const neuron of this.neurons) {
			outputs.push(neuron.activate(inputs));
		}
		return outputs;
	}
}
