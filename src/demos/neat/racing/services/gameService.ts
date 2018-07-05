import { Population } from "../../../../genetic/model";
import { Network } from "../../../../neural-network/model/network";
import { Car } from "../domain/car";
import { Map } from "../domain/map";
import { DrawService } from "./drawService";
import { RaceService } from "./raceService";

const dt = 20;
interface GameState {
	generation: number;
	raceTime: number;
	fitness: number;
	bestBrain?: Network;
}
export class GameService {

	generation = 0;
	raceTime = 0;
	cars: Car[] = [];
	carsBrainsPop: Population<number> = new Population([]);
	raceDuration: number = 10000;
	finalRace = false;
	map: Map = new Map([], []);
	bestFitness = 0;
	bestBrain?: Network;
	onUpdate?: (state: GameState) => void;

	constructor(private drawService: DrawService, private raceService: RaceService) {}

	init = async (brains?: { name: string, brain: Network}[]) => {
		await this.drawService.init();
		await this.raceService.init(brains);
		this.map = this.drawService.loadMap();
		if (brains) {
			this.finalRace = true;
			this.raceDuration = Infinity;
		}
	}

	start = (onUpdate?: (state: GameState) => void) => {
		this.onUpdate = onUpdate;
		requestAnimationFrame(this.update);
	}

	update = () => {
		if (this.raceTime > this.raceDuration) {
			const { bestFitness, bestBrain } = this.raceService.onRaceEnded();
			this.bestFitness = bestFitness;
			this.bestBrain = bestBrain;
			this.generation ++;
			this.raceTime = 0;
		}
		this.raceService.update();
		this.raceService.cars.map(it => it.update(this.map, dt / 1000));
		this.drawService.update(this.map, this.raceService.cars);
		this.raceTime = this.raceTime + dt;
		if (this.onUpdate) {
			this.onUpdate({
				generation: this.generation,
				raceTime: this.raceTime,
				fitness: this.bestFitness,
				bestBrain: this.bestBrain
			});
		}
		requestAnimationFrame(this.update);
	}

}
