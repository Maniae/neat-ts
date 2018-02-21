interface NeuronOptions {

}

export class Neuron {
	private weights: number[] = [];

	constructor(options: NeuronOptions) {}


	private activate = (inputs: number[]) => {
		if (inputs.length !== this.weights.length) {
			throw Error(`expecting an input array of length ${this.weights.length} but array length is ${inputs.length}`)
		}
		const untransferedOutput = inputs.reduce((acc, input, i) => {
			return acc + input * this.weights[i];
		})
	}

	setWeight = (index: number, weight: number) => {
		this.weights[index] = weight;
	}
}