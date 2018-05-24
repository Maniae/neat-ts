import { DrawService } from "./drawService";
import { GameService } from "./gameService";
import { RaceService } from "./raceService";

const raceService = new RaceService();
const drawService = new DrawService();
const gameService = new GameService(drawService, raceService);

export { gameService };
