import { Population } from "../../../../genetic/model";
import { Car } from "../domain/car";
import { Map } from "../domain/map";
import { DrawService } from "./drawService";
import { RaceService } from "./raceService";

const dt = 20;
interface GameState {
	generation: number;
	raceTime: number;
	population: Population<number>;
}
export class GameService {

	generation = 0;
	raceTime = 0;
	cars: Car[] = [];
	carsBrainsPop: Population<number> = new Population([]);
	raceDuration: number = dt * 600;
	map: Map = new Map([], []);
	onUpdate?: (state: GameState) => void;

	constructor(private drawService: DrawService, private raceService: RaceService) {}

	init = async () => {
		await this.drawService.init();
		await this.raceService.init();
		this.map = this.drawService.loadMap();
	}

	start = (onUpdate?: (state: GameState) => void) => {
		this.onUpdate = onUpdate;
		requestAnimationFrame(this.update);
	}

	update = () => {
		if (this.raceTime > this.raceDuration) {
			this.raceService.onRaceEnded();
			this.generation ++;
			this.raceTime = 0;
		}
		this.raceService.update();
		this.raceService.cars.map(it => it.update(this.map, dt / 1000));
		this.drawService.update(this.map, this.raceService.cars);
		this.raceTime = this.raceTime + dt;
		if (this.onUpdate) {
			this.onUpdate({ generation: this.generation, raceTime: this.raceTime, population: this.carsBrainsPop });
		}
		requestAnimationFrame(this.update);
	}

}
