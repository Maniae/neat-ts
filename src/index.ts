import { Network } from "./neural-network/network";

const mainDiv = document.getElementById("main");
if (mainDiv) {
		mainDiv.innerHTML = "" + Network.perceptron([3, 4, 1]).activate([1, 0, 1])[0];
}
