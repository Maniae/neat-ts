"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Neuron {
    constructor(weights, bias, activationFunction) {
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
    get inputSize() {
        return this.weights.length;
    }
    activate(inputs) {
        if (inputs.length !== this.weights.length) {
            throw Error(`expecting an input array of length ${this.weights.length} but array length is ${inputs.length}`);
        }
        const untransferedOutput = inputs.reduce((acc, input, i) => {
            return acc + input * this.weights[i];
        }, 0);
        return this.activationFunction(untransferedOutput + this.bias);
    }
    setWeight(index, weight) {
        this.weights[index] = weight;
    }
    static randomized(inputSize, activationFunction) {
        const inputs = [];
        for (let i = 0; i < inputSize; i++) {
            inputs.push(Math.random() * 2 - 1);
        }
        return new Neuron(inputs, Math.random() * 2 - 1, activationFunction);
    }
}
exports.Neuron = Neuron;
//# sourceMappingURL=neuron.js.map