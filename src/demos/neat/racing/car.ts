import { Network } from "../../../neural-network/model/network";
import { Map } from "./map";
import { Position } from "./position";
import { Vector2 } from "./vector2";

const SENSOR_DISTANCE = 200;
const MAX_SPEED = 1000;
const sensorDelta = 1;
export class Car {

	speed: number = 0;
	direction: number = Math.PI / 4;
	brain?: Network;
	activatedSensors: number[] = [0, 0, 0];
	frozen: boolean = false;
	pos: Position;
	checkPoints: number = 0;
	lastCheckPoint: number | null = null;
	distanceToLastCheckPoint: number = 0;

	constructor(pos: Position, brain?: Network) {
		this.pos = pos;
		this.brain = brain;
	}

	accelerate = () => {
		this.speed += 10;
	}

	brake = () => {
		this.speed -= 10;
	}

	turn = (direction: "right" | "left") => {
		if (!this.frozen) {
			this.direction += 0.1 * (direction === "right" ? 1 : -1);
			this.speed *= 0.99;
		}
	}

	checkCollisions = (map: Map, nextPosX: number, nextPosY: number) => {
		const sensorsActivated = [false, false, false];
		for (let k = 0; k < SENSOR_DISTANCE; k += sensorDelta) {
			const firstSensorPos = {
				x: Math.floor(this.pos.x + 18 + k * Math.cos(this.direction - Math.PI / 4)),
				y: Math.floor(this.pos.y + 9 + k * Math.sin(this.direction - Math.PI / 4))
			};
			const secondSensorPos = {
				x: Math.floor(this.pos.x + 18 + k * Math.cos(this.direction)),
				y: Math.floor(this.pos.y + 9 + k * Math.sin(this.direction))
			};
			const thirdSensorPos = {
				x: Math.floor(this.pos.x + 18 + k * Math.cos(this.direction + Math.PI / 4)),
				y: Math.floor(this.pos.y + 9 + k * Math.sin(this.direction + Math.PI / 4))
			};
			const sensors = [firstSensorPos, secondSensorPos, thirdSensorPos];

			for (let i = 0; i < 3; i ++) {
				if (sensorsActivated[i]) {
					continue;
				}
				if (
					sensors[i].x < 0
					|| sensors[i].x > map.collisionMap.length - 1
					|| sensors[i].y < 0
					|| sensors[i].y > map.collisionMap.length - 1
				) {
					this.activatedSensors[i] = 1;
				} else {
						if (map.collisionMap[sensors[i].x][sensors[i].y]) {
							this.activatedSensors[i] = 0;
						} else {
							this.activatedSensors[i] = (SENSOR_DISTANCE - k) / SENSOR_DISTANCE;
							sensorsActivated[i] = true;
						}
					}
			}
		}

		try {
			if (!map.collisionMap[Math.floor(this.pos.x)][Math.floor(this.pos.y)]) {
				this.frozen = true;
			}
		} catch (e) {
			console.log("failed to check position", Math.floor(this.pos.x), Math.floor(this.pos.y));
			throw e;
		}

		for (let i = 0; i < map.checkPoints.length; i++) {
			const checkPoint = map.checkPoints[i];
			if (this.lastCheckPoint !== i && checkPoint.passed(this.pos, new Position(nextPosX, nextPosY))) {
				this.lastCheckPoint = i;
				this.checkPoints ++;
			}
		}
	}

	update = (map: Map, delta: number) => {
		if (!this.brain) {
			throw Error("This car has no brain");
		}
		this.makeDecision(this.brain);
		if (!this.frozen) {
			const nextPosX = this.pos.x + this.speed * Math.cos(this.direction) * delta;
			const nextPosY = this.pos.y + this.speed * Math.sin(this.direction) * delta;

			this.checkCollisions(map, nextPosX, nextPosY);
			this.speed *= 0.999;
			if (this.speed < 9) {
				this.speed = 0;
			}
			if (this.speed > MAX_SPEED) {
				this.speed = MAX_SPEED;
			}
			this.distanceToLastCheckPoint = this.lastCheckPoint == null ? 0 : map.checkPoints[this.lastCheckPoint].distanceTo(this.pos);
			this.pos.x = nextPosX;
			this.pos.y = nextPosY;
		}
	}

	makeDecision = (brain: Network) => {
		const brainOutput = brain.activate(this.activatedSensors);
		const directionDecision = brainOutput[0];
		const speedDecision = brainOutput[1];
		if (directionDecision > 0.7) {
			this.turn("right");
		} else if (directionDecision < 0.3) {
			this.turn("left");
		}
		if (speedDecision > 0.4) {
			this.accelerate();
		} else {
			this.brake();
		}
		// if (Math.abs(directionDecision) > 0.5) {
		// 	this.turn(directionDecision > 0 ? "right" : "left");
		// }
		// if (Math.abs(speedDecision) > 0.5) {
		// 	if (speedDecision > 0) {
		// 		this.accelerate();
		// 	} else {
		// 		this.brake();
		// 	}
		// }
	}

	draw = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {

		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.translate(18, 9);
		ctx.rotate(this.direction);
		ctx.drawImage(image, -18, -9, 36, 18);

		if (!this.frozen) {
			ctx.beginPath();
			ctx.strokeStyle = this.activatedSensors[0] ? "red" : "blue";
			ctx.moveTo(0, 0);
			ctx.lineTo(SENSOR_DISTANCE / Math.sqrt(2), -SENSOR_DISTANCE / Math.sqrt(2));
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = this.activatedSensors[1] ? "red" : "blue";
			ctx.moveTo(0, 0);
			ctx.lineTo(SENSOR_DISTANCE, 0);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = this.activatedSensors[2] ? "red" : "blue";
			ctx.moveTo(0, 0);
			ctx.lineTo(SENSOR_DISTANCE / Math.sqrt(2), SENSOR_DISTANCE / Math.sqrt(2));
			ctx.stroke();
		}

		ctx.restore();
	}
}
