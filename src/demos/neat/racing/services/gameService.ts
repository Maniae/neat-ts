import { Population } from "../../../../genetic/model";
import { Car } from "../car";
import { DrawService } from "./drawService";
import { RaceService } from "./raceService";

const dt = 1000 / 60;
export class GameService {

	generation = 0;
	raceTime = 0;
	cars: Car[] = [];
	carsBrainsPop: Population<number> = new Population([]);
	raceDuration: number = dt * 600;

	constructor(private drawService: DrawService, private raceService: RaceService) {}

	init = async () => {
		await this.drawService.init();
		await this.raceService.init();
	}

	start = () => {
		requestAnimationFrame(this.update);
	}

	update = () => {
		if (this.raceTime > this.raceDuration) {
			this.raceService.onRaceEnded();
		}
		this.raceService.update();
		this.drawService.update(this.raceService.cars);

		this.raceTime = this.raceTime + dt;
		requestAnimationFrame(update);
	}
}
