import * as checkPoints from "../data/checkPoints.json";
import { Car } from "../domain/car";
import { CheckPoint } from "../domain/checkPoint";
import { Map } from "../domain/map";
import { GameService } from "./gameService";

const carImage = new Image();
carImage.src = "/assets/car.png";
const mapImage = new Image();
mapImage.src = "/assets/raceMap.png";

export class DrawService {

	private canvas: HTMLCanvasElement = null as any;
	private ctx: CanvasRenderingContext2D = null as any;

	init = async () => {
		this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		await loadImage(carImage);
		await loadImage(mapImage);
	}

	update = (map: Map, cars: Car[]) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawMapAndCheckPoints(map);
		cars.map(car => {
			this.drawCar(car);
		});
	}

	drawMapAndCheckPoints = (map: Map) => {
		this.ctx.drawImage(mapImage, 0, 0);
		this.ctx.strokeStyle = "green";
		map.checkPoints.map(it => this.drawLine(it.pos1.x, it.pos1.y, it.pos2.x, it.pos2.y));
	}

	drawCar = (car: Car) => {
		this.ctx.save();
		this.ctx.translate(car.pos.x, car.pos.y);
		this.ctx.translate(car.width / 2, car.height / 2);
		this.ctx.rotate(car.direction);
		this.ctx.drawImage(carImage, -car.width / 2, -car.height / 2, car.width, car.height);
		if (!car.frozen) {
			this.ctx.strokeStyle = car.activatedSensors[0] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange / Math.SQRT2, -car.sensorRange / Math.SQRT2);
			this.ctx.strokeStyle = car.activatedSensors[1] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange, 0);
			this.ctx.strokeStyle = car.activatedSensors[2] ? "red" : "blue";
			this.drawLine(0, 0, car.sensorRange / Math.SQRT2, car.sensorRange / Math.SQRT2);
		}
		this.ctx.restore();
	}

	drawLine = (x1: number, y1: number, x2: number, y2: number) => {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	loadMap = () => {
		this.ctx.drawImage(mapImage, 0, 0);
		const collisionMap: number[][] = [];
		for (let x = 0; x < mapImage.width; x ++) {
			const row = [];
			for (let y = 0; y < mapImage.height; y ++) {
				row.push(this.ctx.getImageData(x, y, 1, 1).data[3] === 0 ? 1 : 0);
			}
			collisionMap.push(row);
		}
		const checkPointArray: CheckPoint[] = (checkPoints as any).map((it: any) => CheckPoint.fromJson(it));
		return new Map(collisionMap, checkPointArray);
	}

}

const loadImage = (image: HTMLImageElement) => new Promise<HTMLImageElement>((resolve, reject) => {
	image.onload = () => {
		resolve(image);
	};
	if (image.complete) {
		resolve(image);
	}
});
