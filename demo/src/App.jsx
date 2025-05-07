import { useState } from "react";
import "./App.css";

import SlowComponent from "./SlowComponent";
import ColorPicker from "./ColorPicker";

function App() {
	const [count, setCount] = useState(0);
	const [color, setColor] = useState("#000000");
	useCallback(() => setCount((c) => c + 1), [setCount]);
	return (
		<>
			<div className="overview">
				<div>
					<ColorPicker value={color} setValue={setColor} />
					<div>Color: {color}</div>
				</div>
				<div>
					<button type="button" onClick={() => setCount((c) => c + 1)}>
						count is {count}
					</button>
				</div>
				<div>
					<SlowComponent />
				</div>
			</div>
		</>
	);
}

export default App;
