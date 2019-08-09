"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Activation {
}
Activation.SIGMOID = (x) => 1 / (1 + Math.exp(-x));
Activation.TANH = (x) => Math.tanh(x);
Activation.LINEAR = (x) => x;
exports.Activation = Activation;
//# sourceMappingURL=activation.js.map