export class Activation {
	static SIGMOID = (x: number) => 1 / (1 + Math.exp(-x));
	static LINEAR = (x: number) => x;
}
