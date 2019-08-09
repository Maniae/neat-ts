"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neuron_1 = require("./neuron");
class Layer {
    constructor(neurons) {
        this.neurons = neurons;
    }
    get size() {
        return this.neurons.length;
    }
    activate(inputs, inputLayer) {
        if (inputLayer) {
            return this.neurons.map((n, i) => n.activate([inputs[i]]));
        }
        return this.neurons.map(n => n.activate(inputs));
    }
    static randomized(layerSize, inputSize, activationFunction) {
        const neurons = [];
        for (let i = 0; i < layerSize; i++) {
            neurons.push(neuron_1.Neuron.randomized(inputSize, activationFunction));
        }
        return new Layer(neurons);
    }
}
exports.Layer = Layer;
//# sourceMappingURL=layer.js.map