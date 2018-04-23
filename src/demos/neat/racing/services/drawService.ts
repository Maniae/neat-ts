import { Car } from "../car";
import { GameService } from "./gameService";

export class DrawService {

	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;

	init = async () => {
		await loadImage(carImage);
		await loadImage(mapImage);
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d")!;
	}

	update = (cars: Car[]) => {
		
	}

}

const loadImage = (image: HTMLImageElement) => new Promise<HTMLImageElement>((resolve, reject) => {
	image.onload = () => {
		console.log("resolved", image.src);
		resolve(image);
	};
	if (image.complete) {
		resolve(image);
	}
});
