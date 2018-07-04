import { Population } from "../../../../genetic/model";
import { Network } from "../../../../neural-network/model/network";
import { Car } from "../domain/car";
import { Position } from "../domain/position";

const startPositionX = 200;
const startPositionY = 50;
const layersSizes = [4, 4, 4, 2];

export class RaceService {

	cars: Car[] = [];
	carsPop: Population<number> = new Population([]);

	init = () => {
		/**
		 * Called once at launch
		 */
		this.carsPop = Population.generatePopulation(
			100,
			() => Network.perceptron(layersSizes).weights,
			{
				mutate: this.mutate,
				mutationProbability: 0.4
			}
		);
		this.cars = this.carsPop.candidates.map(
			it => new Car(startPositionX, startPositionY, Network.fromWeights(it.genes, layersSizes))
		);
		this.carsPop.candidates.map((it, i) => {
			it.fitness = this.fitness(i);
		});
	}

	update = () => {
		/**
		 * Called on every frame
		 */
		this.cars.map(car => {
			if (!car.brain) {
				throw Error("This car has no brain");
			}
			const brainOutput = car.brain.activate([...car.activatedSensors, car.speed / car.maxSpeed]);
			const directionDecision = brainOutput[0];
			const speedDecision = brainOutput[1];
			if (directionDecision > 0) {
				car.turn("right");
			} else {
				car.turn("left");
			}
			if (speedDecision > 0) {
				car.accelerate();
			} else {
				car.brake();
			}
		});
	}

	onRaceEnded = (): number => {
		/**
		 * Called on every race timeout
		 */
		const bestFitness = this.getBestFitness();

		this.carsPop = this.carsPop.createNextGeneration();
		this.cars = this.carsPop.candidates.map(
			it => new Car(startPositionX, startPositionY, Network.fromWeights(it.genes, layersSizes))
		);
		this.carsPop.candidates.map((it, i) => {
			it.fitness = this.fitness(i);
		});

		return bestFitness;
	}

	mutate = (genes: number[]) => {
		const genesCopy = genes.slice(0);
		const randomIndex = Math.floor(Math.random() * genes.length);
		genesCopy[randomIndex] = Math.random() * 2 - 1;
		return genesCopy;
	}

	fitness = (index: number) => () => {
		return this.cars[index].checkPoints;
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
