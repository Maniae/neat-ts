import { Population } from "../../../../genetic/model";
import { Car } from "../car";
import { Map } from "../map";
import * as checkPoints from "./checkPoints.json";
import { DrawService } from "./drawService";
import { RaceService } from "./raceService";

const dt = 20;
export class GameService {

	generation = 0;
	raceTime = 0;
	cars: Car[] = [];
	carsBrainsPop: Population<number> = new Population([]);
	raceDuration: number = dt * 600;
	map: Map = new Map([], []);

	constructor(private drawService: DrawService, private raceService: RaceService) {}

	init = async () => {
		await this.drawService.init();
		await this.raceService.init();
		this.map = this.drawService.loadMap();
	}

	start = () => {
		requestAnimationFrame(this.update);
	}

	update = () => {
		if (this.raceTime > this.raceDuration) {
			this.raceService.onRaceEnded();
			this.raceTime = 0;
		}
		this.raceService.update();
		this.raceService.cars.map(it => it.update(this.map, dt / 1000));
		this.drawService.update(this.map, this.raceService.cars);

		this.raceTime = this.raceTime + dt;
		requestAnimationFrame(this.update);
	}

}
