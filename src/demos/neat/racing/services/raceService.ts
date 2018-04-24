import { Population } from "../../../../genetic/model";
import { Network } from "../../../../neural-network/model/network";
import { Car } from "../car";
import { Position } from "../position";

const startPosition = new Position(200, 50);
const layersSizes = [3, 4, 4, 2];

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
				mutate,
				mutationProbability: 0.4
			}
		);
		this.cars = this.carsPop.candidates.map(it => new Car(startPosition, Network.fromWeights(it.genes, layersSizes)));
		this.carsPop.candidates.map((it, i) => {
			it.fitness = fitness(i);
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
			const brainOutput = car.brain.activate(car.activatedSensors);
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

	onRaceEnded = () => {
		/**
		 * Called on every race timeout
		 */
		this.carsPop = this.carsPop.createNextGeneration();
		this.cars = this.carsPop.candidates.map(it => new Car(startPosition, Network.fromWeights(it.genes, layersSizes)));
		this.carsPop.candidates.map((it, i) => {
			it.fitness = fitness(i);
		});

	}
}
