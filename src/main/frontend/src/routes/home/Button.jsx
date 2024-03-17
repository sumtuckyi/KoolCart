import { Button } from "@nextui-org/react";

export default function CateButton({ list, handleClick }) {

	const buttonStyle = {
		width: '70px',
		height: '24px',
		margin: '5px',
		position: 'relative',
		padding: '5px',
		border: 'none',
		borderRadius: '5px',
		backgroundColor: '#99A9D5',
		backdropFilter: 'blur(15px)',
		boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)'
	}

	// const handleClick = (key, e) => {
	// 	console.log(key)
	// }

	return (
		list.map((item, i) => {
			return (
				<Button
					key={i}
					style={buttonStyle}
					onClick={() => handleClick(i)}
				>
					{item}
				</Button>
			)
		})
	)
}