import { CheckPoint } from "./checkPoint";

export class Map {
	constructor(readonly collisionMap: number[][], readonly checkPoints: CheckPoint[]) {}
}
