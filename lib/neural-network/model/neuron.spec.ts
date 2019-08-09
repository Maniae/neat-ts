import { Neuron } from "./neuron";

describe("Neuron", () => {
	it("compute inputs and gives results according to weights and bias", () => {
		const neuron = new Neuron([1, 1, 1], 0.5, x => x);

		const output1 = neuron.activate([3, 3, 3]);
		expect(output1).toEqual(9.5);

		const output2 = neuron.activate([3, -3, -3]);
		expect(output2).toEqual(-2.5);
	});
});
