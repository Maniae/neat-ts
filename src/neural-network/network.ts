import { Layer } from "./layer";

interface NetworkOptions {
	layers: Layer[];
}
export class Network {
	layers: Layer[];

	static perceptron(layersSizes: number[]) {
		return new Network({
			layers: layersSizes.reduce((layers: Layer[], size, index: number) => {
				layers.push(new Layer({
					size,
					isInputLayer: index === 0,
					inputsSize: index > 0 ? layers[index - 1].size : undefined
				}));
				return layers;
			}, [])
		});
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
			throw Error("Network inputs lenght should match first layer size");
		}
		return this.layers.reduce((prevOutput: number[], layer) => layer.activate(prevOutput), inputs);
	}
}
