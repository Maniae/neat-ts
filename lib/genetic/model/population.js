"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methods_1 = require("../methods");
const candidate_1 = require("./candidate");
class Population {
    constructor(candidates, options = {}) {
        this.candidates = candidates;
        this.select = options.select || methods_1.Selection.RANK();
        this.fitness = options.fitness || (() => 0);
        this.mutate = options.mutate || (g => g);
        this.cross = options.cross || methods_1.Crossover.SINGLE_POINT();
        this.mutationProbability = options.mutationProbability || 0.2;
        this.candidates.sort((a, b) => this.fitness(b) - this.fitness(a));
    }
    get bestCandidate() {
        return this.candidates[0];
    }
    get bestFitness() {
        return this.fitness(this.bestCandidate);
    }
    createNextGeneration() {
        /**
         * Select stronger candidates
         */
        const selectedCandidates = this.select(this.candidates, this.fitness);
        /**
         * Cross stronger candidates and mutates their children
         */
        const newCandidates = this.crossCandidates(selectedCandidates);
        /**
         * Add the children to the population
         */
        /**
         * Keep the stronger candidates
         */
        const bestElders = this.candidates
            .sort((a, b) => this.fitness(b) - this.fitness(a))
            .slice(0, this.candidates.length - newCandidates.length);
        const newPopulation = newCandidates.concat(bestElders);
        return new Population(newPopulation, this.getOptions());
    }
    crossCandidates(candidates) {
        if (candidates.length % 2 !== 0) {
            throw Error("Selection size should be a multiple of 2");
        }
        const children = [];
        for (let i = 0; i < candidates.length; i += 2) {
            let [firstChildGenes, secondChildGenes] = this.cross(candidates[i].genes, candidates[i + 1].genes);
            if (Math.random() < this.mutationProbability) {
                firstChildGenes = this.mutate(firstChildGenes);
            }
            if (Math.random() < this.mutationProbability) {
                secondChildGenes = this.mutate(secondChildGenes);
            }
            children.push(new candidate_1.Candidate(firstChildGenes));
            children.push(new candidate_1.Candidate(secondChildGenes));
        }
        return children;
    }
    getOptions() {
        return {
            fitness: this.fitness,
            mutate: this.mutate,
            select: this.select,
            cross: this.cross,
            mutationProbability: this.mutationProbability,
        };
    }
    /**
     * Generate a new randomized population
     * @param size The size of the population
     * @param geneGenerator a function generating a random set of genes
     * @param options Population options parameter
     */
    static generatePopulation(size, geneGenerator, options) {
        const candidates = [];
        for (let i = 0; i < size; i++) {
            candidates.push(new candidate_1.Candidate(geneGenerator()));
        }
        return new Population(candidates, options);
    }
}
exports.Population = Population;
//# sourceMappingURL=population.js.map