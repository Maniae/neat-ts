import { Population } from "../../../genetic/model";
import { Network } from "../../../neural-network/model/network";
import { Car } from "./car";
import { Position } from "./position";
import { Vector2 } from "./vector2";

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
		let cars = carsPop.candidates.map(it => new Car(new Position(50, 50), Network.fromWeights(it.genes, [3, 4, 2, 2])));
		for (let i = 0; i < cars.length; i++) {
			carsPop.candidates[i].fitness = () => {
				return cars[i].pos.distanceTo(new Position(50, 50));
			};
		}
		let raceTime = 0;
		let t0 = Date.now();
		ctx.drawImage(mapImage, 0, 0);
		const map = loadMap(mapImage);
		while (true) {
			if (raceTime > 5000) {
				console.log("evolve");
				raceTime = 0;
				carsPop = carsPop.createNextGeneration();
				cars = carsPop.candidates.map(it => new Car(new Position(50, 50), Network.fromWeights(it.genes, [3, 4, 2, 2])));
				for (let i = 0; i < cars.length; i++) {
					carsPop.candidates[i].fitness = () => {
						return cars[i].pos.distanceTo(new Position(50, 50));
					};
				}
			}
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.drawImage(mapImage, 0, 0);
			const t1 = Date.now();
			const dt = t1 - t0;
			cars.map(it => {
				it.update(map, dt / 1000);
				it.draw(ctx, carImage);
			});
			t0 = t1;
			raceTime = raceTime + dt;
			const waitTime = Math.max(0, (1000 / 60) - dt);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
	}

	function createPopulation() {
		return Population.generatePopulation(
			40,
			() => Network.perceptron([3, 4, 2, 2]).weights,
			{
				mutate,
				mutationProbability: 0.4
			}
		);
	}

	function loadMap(image: HTMLImageElement) {
		const map: number[][] = [];
		for (let x = 0; x < image.width; x ++) {
			const row = [];
			for (let y = 0; y < image.height; y ++) {
				row.push(ctx.getImageData(x, y, 1, 1).data[3] === 0 ? 1 : 0);
			}
			map.push(row);
		}
		console.log(map.length, map[0].length);
		return map;
	}
}
