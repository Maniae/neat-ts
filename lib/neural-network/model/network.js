"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = require("./layer");
const neuron_1 = require("./neuron");
class Network {
    constructor(layers) {
        this.layers = layers;
    }
    activate(inputs) {
        if (inputs.length !== this.layers[0].size) {
            throw Error(`Network inputs length should match first layer size, expected ${this.layers[0].size} but got ${inputs.length}`);
        }
        return this.layers.reduce((prevOutput, layer, i) => layer.activate(prevOutput, i === 0), inputs);
    }
    static fromWeights(weights, biases, layersSizes, activationFunction) {
        let weightIndex = 0;
        let neuronCount = 0;
        const layers = [];
        for (let i = 0; i < layersSizes.length; i++) {
            const neurons = [];
            const inputSize = i === 0 ? 1 : layersSizes[i - 1];
            for (let j = 0; j < layersSizes[i]; j++) {
                neurons.push(new neuron_1.Neuron(weights.slice(weightIndex, weightIndex + inputSize), biases[neuronCount], activationFunction));
                weightIndex += inputSize;
                neuronCount++;
            }
            layers.push(new layer_1.Layer(neurons));
        }
        return new Network(layers);
    }
    get weights() {
        return this.layers.reduce((layAcc, layer) => layAcc.concat(layer.neurons.reduce((neuronAcc, neuron) => neuronAcc.concat(neuron.weights), [])), []);
    }
    get biases() {
        return this.layers.reduce((acc, layer) => acc.concat(layer.neurons.map(n => n.bias)), []);
    }
    static toJson(network) {
        return {
            weights: network.weights,
            biases: network.biases,
            layersSizes: network.layers.map(it => it.neurons.length),
        };
    }
    static fromJson(json, activationFunction) {
        return Network.fromWeights(json.weights, json.biases, json.layersSizes, activationFunction);
    }
    static randomized(layersSizes, activationFunction) {
        return new Network(layersSizes.reduce((acc, size, i) => {
            const inputSize = layersSizes[i - 1] || 1;
            acc.push(layer_1.Layer.randomized(size, inputSize, activationFunction));
            return acc;
        }, []));
    }
}
exports.Network = Network;
//# sourceMappingURL=network.js.map