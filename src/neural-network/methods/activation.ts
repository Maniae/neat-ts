export class Activation {
	static SIGMOID = (x: number) => 1 / (1 + Math.exp(-x));
	static TANH = (x: number) => Math.tanh(x);
	static LINEAR = (x: number) => x;
}
