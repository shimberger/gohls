import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import * as React from 'react';
import { Link } from "react-router-dom";

const overlayStyles = {
	alignItems: 'center' as const,
	backgroundSize: "cover",
	bottom: 0,
	display: 'flex',
	justifyItems: 'center' as const,
	left: 0,
	position: 'absolute' as const,
	right: 0,
	textAlign: 'center' as const,
	top: 0,
}

const actionIconStyles = {
	opacity: 0,
	transition: 'all 0.5s',
	color: 'white',
	fontSize: '70px',
}

const buttonStyles = {
	display: 'block'
}

const imageStyles = {
	backgroundColor: '#222',
	paddingTop: '56.25%',
	position: 'relative' as 'relative',
}

const overlayIconStyles = {
	margin: '0 auto',
}

const cardStyles = {
	"&:hover": {
		transform: 'scale(1.05)',
		".actionIcon": {
			opacity: '1 !important',
			transform: 'scale(1.25)',
		},
	},
	".actionIcon": {
		transform: 'scale(1.75)',
	},
	flexGrow: 1,
	overflow: 'hidden' as const,
	position: 'relative' as const,
	transition: 'all 0.1s',
	translate: 'transformZ(0)'
}

export default function ListItem(props) {
	const Icon = props.icon;
	let icon2 = null;
	if (props.actionIcon) {
		const ActionIcon = props.actionIcon;
		icon2 = <ActionIcon
			className="actionIcon"
			style={actionIconStyles}
		/>
	}
	const image = props.image || 'none'
	return (
		<Card sx={cardStyles}>
			<ButtonBase
				focusRipple={true}
				component={Link}
				// @ts-ignore
				to={props.to}
				sx={buttonStyles}
			>
				<div style={imageStyles}>

					<div style={overlayStyles}>
						<div style={overlayIconStyles}>
							<Icon
								style={{
									color: '#444',
									fontSize: '70px',
								}}
							/>
						</div>
					</div>

					<div style={{ backgroundImage: image, ...overlayStyles }} />

					<div style={overlayStyles} >
						<div style={overlayIconStyles}>
							{icon2}
						</div>
					</div>

				</div>
			</ButtonBase>
			{props.children}
		</Card>
	)
}
