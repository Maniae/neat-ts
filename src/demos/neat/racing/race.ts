import { gameService } from "./services";

export async function race() {
	await gameService.init();
	gameService.start();
}
