import * as React from "react";
import * as ReactDOM from "react-dom";
import { FindPasswordView } from "./demos/genetic/findPasswordView";
import { SalesmanView } from "./demos/genetic/salesmanView";

type Demo = "findPassword" | "salesman" | "xor" | "race" | "none";

interface AppState {
	demo: Demo;
}

class App extends React.Component<{}, AppState> {

	constructor(props: {}) {
		super(props);
		this.state = { demo: "salesman" };
	}
	render() {
		return <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			{this.renderDemo(this.state.demo)}
		</div>;
	}

	renderDemo = (demo: Demo) => {
		switch (demo) {
			case "findPassword":
				return <FindPasswordView />;
			case "salesman":
				return <SalesmanView />;
			case "xor":
				return null;
			case "race":
				return null;
			default:
				return null;
		}
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("main")
);
