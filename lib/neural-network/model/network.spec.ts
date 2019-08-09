import { Layer } from "./layer";
import { Network } from "./network";
import { Neuron } from "./neuron";

describe("Network", () => {
	it("Activate every layer of the network according to the given inputs", () => {
		const inputLayer = new Layer([
			new Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x),
			new Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x),
			new Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x),
		]);

		const hiddenLayer = new Layer([
			new Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x),
			new Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x),
		]);

		const outputLayer = new Layer([new Neuron([Math.random(), Math.random()], Math.random(), x => x)]);

		const layers = [inputLayer, hiddenLayer, outputLayer];
		const [spy1, spy2, spy3] = layers.map(l => jest.spyOn(l, "activate"));

		const network = new Network(layers);

		const inputs = [Math.random(), Math.random(), Math.random()];

		const output = network.activate(inputs);

		expect(spy1).toHaveBeenCalledWith(inputs);
		expect(spy2).toHaveBeenCalledWith(inputLayer.activate(inputs));
		expect(spy3).toHaveBeenCalledWith(hiddenLayer.activate(inputLayer.activate(inputs)));

		expect(output).toEqual(outputLayer.activate(hiddenLayer.activate(inputLayer.activate(inputs))));
	});

	it("Creates a neural network with an array of weights and input sizes", () => {
		const l1Weights = [Math.random(), Math.random(), Math.random()];
		const l2Weights = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
		const l3Weights = [Math.random(), Math.random()];

		const weights = [...l1Weights, ...l2Weights, ...l3Weights];
		const biases = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

		const layersSizes = [3, 2, 1];

		const network = Network.fromWeights(weights, biases, layersSizes, x => x);

		expect(network.weights).toEqual(weights);
		expect(network.biases).toEqual(biases);
	});

	it("Serializes and deserializes a network", () => {
		const l1Weights = [Math.random(), Math.random(), Math.random()];
		const l2Weights = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
		const l3Weights = [Math.random(), Math.random()];

		const weights = [...l1Weights, ...l2Weights, ...l3Weights];
		const biases = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

		const layersSizes = [3, 2, 1];

		const network = Network.fromWeights(weights, biases, layersSizes, x => x);

		expect(JSON.stringify(Network.fromJson(Network.toJson(network), x => x))).toBe(JSON.stringify(network));
	});

	it("Generates a network with layer sizes", () => {
		const layersSize = [3, 2, 4, 1];

		const network = Network.randomized(layersSize, x => x);

		expect(network.biases.length).toBe(3 + 2 + 4 + 1);
		expect(network.weights.length).toBe(3 + 2 * 3 + 4 * 2 + 4 * 1);
	});
});
