import { Car } from "./car";
import { map } from "./map";
import { Vector2 } from "./vector2";

export function race() {
	const c = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = c.getContext("2d")!;

	let mapLoaded = false;

	const image = new Image();
	image.src = "http://www.clker.com/cliparts/4/W/7/2/D/5/tack-car-top-view-hi.png";
	const mapImage = new Image();
	mapImage.src = "https://image.ibb.co/c8h7Z7/New_Piskel_1.png";
	mapImage.onload = () => mapLoaded = true;

	const car = new Car({x: 50, y: 50});
	window.onkeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowDown":
				car.brake();
				break;
			case "ArrowUp":
				car.accelerate();
				break;
			case "ArrowLeft":
				car.turn("left");
				break;
			case "ArrowRight":
				car.turn("right");
				break;
		}
	};
	image.onload = run;

	async function run() {
		let t0 = Date.now();
		while (true) {
			ctx.clearRect(0, 0, c.width, c.height);
			if (mapLoaded) {
				ctx.drawImage(mapImage, 0, 0);
			}
			const t1 = Date.now();
			const dt = t1 - t0;
			car.update(map, dt / 1000);
			car.draw(ctx, image);
			t0 = t1;
			const waitTime = Math.max(0, (1000 / 60) - dt);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
	}
}
