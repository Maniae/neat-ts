export class Vector2 {

	constructor(public x: number, public y: number) {}

	get norm(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}
