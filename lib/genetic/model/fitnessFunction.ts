import { Candidate } from "./candidate";

export type FitnessFunction<T> = (candidate: Candidate<T>) => number;
