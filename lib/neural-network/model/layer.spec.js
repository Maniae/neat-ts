"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = require("./layer");
const neuron_1 = require("./neuron");
describe("Layer", () => {
    it("Activate every neuron of the layer with the given inputs", () => {
        const inputs = [Math.random(), Math.random(), Math.random()];
        const n1 = new neuron_1.Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x);
        const n2 = new neuron_1.Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x);
        const n3 = new neuron_1.Neuron([Math.random(), Math.random(), Math.random()], Math.random(), x => x);
        const neurons = [n1, n2, n3];
        const [spy1, spy2, spy3] = neurons.map(n => jest.spyOn(n, "activate"));
        const layer = new layer_1.Layer(neurons);
        const output = layer.activate(inputs);
        expect(spy1).toHaveBeenCalledWith(inputs);
        expect(spy2).toHaveBeenCalledWith(inputs);
        expect(spy3).toHaveBeenCalledWith(inputs);
        expect(output).toEqual([n1.activate(inputs), n2.activate(inputs), n3.activate(inputs)]);
    });
});
//# sourceMappingURL=layer.spec.js.map