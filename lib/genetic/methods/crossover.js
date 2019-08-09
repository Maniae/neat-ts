"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Crossover {
}
Crossover.SINGLE_POINT = (crossProbability = 0.8) => (motherGenes, fatherGenes) => {
    const firstChildGenes = [];
    const secondChildGenes = [];
    /**
     * Cross the two parents genes according to the cross probability
     */
    for (let i = 0; i < motherGenes.length; i++) {
        firstChildGenes.push(Math.random() < crossProbability ? motherGenes[i] : fatherGenes[i]);
        secondChildGenes.push(Math.random() < crossProbability ? fatherGenes[i] : motherGenes[i]);
    }
    return [firstChildGenes, secondChildGenes];
};
exports.Crossover = Crossover;
//# sourceMappingURL=crossover.js.map