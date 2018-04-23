import { Selection } from "../../../genetic/methods";
import { Population } from "../../../genetic/model";
import { Activation } from "../../../neural-network/methods";
import { Network } from "../../../neural-network/model/network";
import { Car } from "./car";
import { CheckPoint } from "./checkPoint";
import * as checkPoints from "./checkPoints.json";
import { Map } from "./map";
import { Position } from "./position";
import { Vector2 } from "./vector2";

const dt = 1000 / 60;

export function race() {
	const c = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = c.getContext("2d")!;

	const carImage = new Image();
	carImage.src = "/assets/car.png";
	const mapImage = new Image();
	mapImage.src = "/assets/raceMap.png";

	const loadImage = (image: HTMLImageElement) => new Promise<HTMLImageElement>((resolve, reject) => {
		image.onload = () => {
			console.log("resolved", image.src);
			resolve(image);
		};
		if (image.complete) {
			resolve(image);
		}
	});

	const mutate = (genes: number[]) => {
		const genesCopy = genes.slice(0);
		const randomIndex = Math.floor(Math.random() * genes.length);
		genesCopy[randomIndex] = Math.random() * 2 - 1;
		return genesCopy;
	};

	run();

	async function run() {
		try {
			await loadImage(carImage);
			await loadImage(mapImage);
		} catch {
			console.log("oups");
			throw Error("failed to load images");
		}
		let carsPop = createPopulation();
		let cars = carsPop.candidates.map(it => new Car(new Position(200, 50), Network.fromWeights(it.genes, [3, 4, 4, 2])));
		for (let i = 0; i < cars.length; i++) {
			carsPop.candidates[i].fitness = () => {
				return cars[i].checkPoints * 1000;
				// return cars[i].pos.distanceTo(new Position(200, 50));
				// return 1 - (cars[i].pos.x + cars[i].pos.y);
			};
		}
		let raceTime = 0;
		ctx.drawImage(mapImage, 0, 0);
		const map = loadMap(mapImage, checkPoints);
		let generation = 0;

		while (generation < 30) {
			if (raceTime > 10000 ) {
				console.log(generation);
				generation++;
				raceTime = 0;
				carsPop = carsPop.createNextGeneration();
				cars = carsPop.candidates.map(
					it => new Car(new Position(200, 50), Network.fromWeights(it.genes, [3, 4, 4, 2]))
				);
				for (let i = 0; i < cars.length; i++) {
						carsPop.candidates[i].fitness = () => {
							return cars[i].checkPoints * 1000;
						};
				}
			}
			cars.map(it => {
				it.update(map, dt / 1000);
			});
			// cars[0].draw(ctx, carImage);
			raceTime = raceTime + dt;
		}
		requestAnimationFrame(loop);

		let t0 = Date.now();
		function loop() {
			if (raceTime > 60000) {
				generation++;
				console.log("generation", generation, Date.now() - t0, raceTime);
				t0 = Date.now();
				raceTime = 0;
				console.table(carsPop.candidates.sort((a, b) => b.fitness([]) - a.fitness([])).slice(0, 10).map(it => it.fitness([])));
				carsPop = carsPop.createNextGeneration();
				cars = carsPop.candidates.map(
					it => new Car(new Position(200, 50), Network.fromWeights(it.genes, [3, 4, 4, 2]))
				);
				for (let i = 0; i < cars.length; i++) {
						carsPop.candidates[i].fitness = () => {
							return cars[i].checkPoints * 1000;
						};
				}
			}
			ctx.clearRect(0, 0, c.width, c.height);
			drawCheckPoints(map.checkPoints);
			ctx.drawImage(mapImage, 0, 0);
			cars.map(it => {
				it.update(map, dt / 1000);
				it.draw(ctx, carImage);
			});
			// cars[0].draw(ctx, carImage);
			raceTime = raceTime + dt;
			// const waitTime = Math.max(0, (1000 / 60) - dt);
			// const waitTime = dt;
			requestAnimationFrame(loop);
		}
	}

	function createPopulation() {
		return Population.generatePopulation(
			100,
			() => Network.perceptron([3, 4, 4, 2]).weights,
			{
				mutate,
				mutationProbability: 0.4
			}
		);
	}

	function loadMap(image: HTMLImageElement, checkPointsJson: any) {
		const collisionMap: number[][] = [];
		for (let x = 0; x < image.width; x ++) {
			const row = [];
			for (let y = 0; y < image.height; y ++) {
				row.push(ctx.getImageData(x, y, 1, 1).data[3] === 0 ? 1 : 0);
			}
			collisionMap.push(row);
		}
		const checkPointArray: CheckPoint[] = checkPointsJson.map((it: any) => CheckPoint.fromJson(it));
		return new Map(collisionMap, checkPointArray);
	}

	function drawCheckPoints(checkPointArray: CheckPoint[]) {
		checkPointArray.map(it => {
			ctx.beginPath();
			ctx.strokeStyle = "green";
			ctx.moveTo(it.pos1.x, it.pos1.y);
			ctx.lineTo(it.pos2.x, it.pos2.y);
			ctx.stroke();
		});
	}
}
