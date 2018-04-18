import { Network } from "../../../neural-network/model/network";
import { Vector2 } from "./vector2";

const SENSOR_DISTANCE = 80;
export interface Position { x: number; y: number; }

export class Car {

	speed: number = 0;
	direction: number = Math.PI / 4;
	brain?: Network;
	activatedSensors: number[] = [0, 0, 0];

	constructor(public pos: Position) {}

	// get direction(): number {
	// 	if (this.velocity.norm === 0) {
	// 		return 0;
	// 	}
	// 	return Math.acos(this.velocity.x / this.velocity.norm) * (this.velocity.y > this.pos.y ? -1 : 1);
	// }

	accelerate = () => {
		this.speed += 10;
	}

	brake = () => {
		this.speed -= 10;
	}

	turn = (direction: "right" | "left") => {
		this.direction += 0.1 * (direction === "right" ? 1 : -1);
		this.speed *= 0.99;
	}

	checkCollisions = (map: number[][]) => {
		const firstSensorPos = {
			x: Math.floor(this.pos.x + 18 + SENSOR_DISTANCE * Math.cos(this.direction - Math.PI / 4)),
			y: Math.floor(this.pos.y + 9 + SENSOR_DISTANCE * Math.sin(this.direction - Math.PI / 4))
		};
		const secondSensorPos = {
			x: Math.floor(this.pos.x + 18 + SENSOR_DISTANCE * Math.cos(this.direction)),
			y: Math.floor(this.pos.y + 9 + SENSOR_DISTANCE * Math.sin(this.direction))
		};
		const thirdSensorPos = {
			x: Math.floor(this.pos.x + 18 + SENSOR_DISTANCE * Math.cos(this.direction + Math.PI / 4)),
			y: Math.floor(this.pos.y + 9 + SENSOR_DISTANCE * Math.sin(this.direction + Math.PI / 4))
		};
		const sensors = [firstSensorPos, secondSensorPos, thirdSensorPos];

		for (let i = 0; i < 3; i ++) {
			if (map[sensors[i].y][sensors[i].x]) {
				this.activatedSensors[i] = 0;
			} else {
				this.activatedSensors[i] = 1;
			}
		}
	}

	update = (map: number[][], delta: number) => {
		// if (!this.brain) {
		// 	throw Error("This car has no brain");
		// }
		// this.brain.activate(this.getSensorInputs);
		this.checkCollisions(map);
		this.speed *= 0.999;
		if (this.speed < 9) {
			this.speed = 0;
		}
		this.pos.x += this.speed * Math.cos(this.direction) * delta;
		this.pos.y += this.speed * Math.sin(this.direction) * delta;
	}

	draw = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {

		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.translate(18, 9);
		ctx.rotate(this.direction);
		ctx.drawImage(image, -18, -9, 36, 18);

		ctx.beginPath();
		ctx.strokeStyle = this.activatedSensors[0] ? "red" : "blue";
		ctx.moveTo(0, 0);
		ctx.lineTo(SENSOR_DISTANCE, -SENSOR_DISTANCE);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = this.activatedSensors[1] ? "red" : "blue";
		ctx.moveTo(0, 0);
		ctx.lineTo(SENSOR_DISTANCE, 0);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = this.activatedSensors[2] ? "red" : "blue";
		ctx.moveTo(0, 0);
		ctx.lineTo(SENSOR_DISTANCE, SENSOR_DISTANCE);
		ctx.stroke();

		ctx.restore();
	}
}
