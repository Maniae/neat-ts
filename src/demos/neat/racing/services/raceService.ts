import { Population } from "../../../../genetic/model";
import { Network } from "../../../../neural-network/model/network";
import { Car } from "../domain/car";
import { Position } from "../domain/position";

/**
 * Touch with the eyes
 */
const startPositionX = 200;
const startPositionY = 50;

/**
 * Edit your configs here:
 */

// const populationSize = 0;
// const mutationProbability = 0;
/**
 * The sizes of neural network layers, the first element is the number of inputs, last element is the number of outputs
 */
// const layersSizes = [0]

export class RaceService {

	cars: Car[] = [];
	carsPop: Population<number> = new Population([]);
	finalRace = false;

	update = () => {
		/**
		 * Called on every frame
		 */
		this.cars.map(car => {
			if (!car.brain) {
				throw Error("This car has no brain");
			}
			/**
			 * Customize inputs and use output to have the car take decisions
			 */

			// const inputs: number[] = [];
			// const brainOutput = car.brain.activate(inputs);

		});
	}

	mutate = (genes: number[]) => {
		/**
		 * Randomly make genes mutate (the function should not mutate the genes array)
		 * (Yes that's an issue with the genetic algorithm vocabulary)
		 */

		// const genesCopy = genes.slice(0);
		// return genesCopy;
	}

	fitness = (index: number) => () => {
		/**
		 * The fitness function that should be maxed
		 */

		// return 0;
	}

	/**
	 *
	 *
	 *
	 * Utility functions, nothing to do here
	 *
	 *
	 *
	 */

	init = (brains?: { name: string, brain: Network}[]) => {
		/**
		 * Called once at launch
		 */
		if (brains) {
			this.finalRace = true;
			this.cars = brains.map(it => new Car(startPositionX, startPositionY, it.brain, it.name));
		} else {
			this.carsPop = Population.generatePopulation(
				populationSize,
				() => Network.perceptron(layersSizes).weights,
				{
					mutate: this.mutate,
					mutationProbability
				}
			);
			this.cars = this.carsPop.candidates.map(
				it => new Car(startPositionX, startPositionY, Network.fromWeights(it.genes, layersSizes))
			);
			this.carsPop.candidates.map((it, i) => {
				it.fitness = this.fitness(i);
			});
		}
	}

	onRaceEnded = () => {
		/**
		 * Called on every race timeout
		 */
		const bestFitness = this.getBestFitness();
		const bestBrain = this.getBestBrain();

		if (!this.finalRace) {
			this.carsPop = this.carsPop.createNextGeneration();
			this.cars = this.carsPop.candidates.map(
				it => new Car(startPositionX, startPositionY, Network.fromWeights(it.genes, layersSizes))
			);
			this.carsPop.candidates.map((it, i) => {
				it.fitness = this.fitness(i);
			});
		}

		return { bestFitness, bestBrain };
	}

	getBestFitness = () => {
		this.carsPop.candidates.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes));
		return this.carsPop.candidates[0].fitness(this.carsPop.candidates[0].genes);
	}

	getBestBrain = () => {
		this.carsPop.candidates.sort((a, b) => b.fitness(b.genes) - a.fitness(a.genes));
		return Network.fromWeights(this.carsPop.candidates[0].genes, layersSizes);
	}
}
