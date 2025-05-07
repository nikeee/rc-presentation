

export default function ColorPicker({value, setValue}) {
	return (
		<div>
				<input
					type="color"
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
				/>
		</div>
	);
}
