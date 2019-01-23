import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import * as React from 'react';
import { Link } from "react-router-dom";


const styles = {
	actionIcon: {
		opacity: 0,
		transform: 'scale(1.75)',
		transition: 'all 0.5s',
	},
	button: {
		display: 'block'
	},
	image: {
		backgroundColor: '#222',
		paddingTop: '56.25%',
		position: 'relative',
	},
	overlay: {
		alignItems: 'center',
		backgroundSize: "cover",
		bottom: 0,
		display: 'flex',
		justifyItems: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
		textAlign: 'center',
		top: 0,
	},
	overlayIcon: {
		margin: '0 auto',
	},
	root: {
		"&:hover": {
			transform: 'scale(1.05)'
		},
		"&:hover $actionIcon": {
			opacity: [1, '!important'],
			transform: 'scale(1.25)',

		},
		flexGrow: 1,
		overflow: 'hidden',
		position: 'relative',
		transition: 'all 0.1s',
		translate: 'transformZ(0)'
	},
} as any;

function ListItem(props) {
	const { classes } = props;
	const Icon = props.icon;
	let icon2 = null;
	if (props.actionIcon) {
		const ActionIcon = props.actionIcon;
		icon2 = <ActionIcon
			className={classNames(classes.actionIcon)}
			style={{
				color: 'white',
				fontSize: '70px',
			}}
		/>
	}
	const image = props.image || 'none'
	return (
		<Card className={classNames(classes.root)}>
			<ButtonBase
				focusRipple={true}
				component={Link}
				// @ts-ignore
				to={props.to}
				className={classNames(classes.button)}
			>
				<div className={classes.image}>

					<div className={classNames(classes.overlay)}>
						<div className={classNames(classes.overlayIcon)}>
							<Icon
								style={{
									color: '#444',
									fontSize: '70px',
								}}
							/>
						</div>
					</div>

					<div className={classNames(classes.overlay)} style={{ backgroundImage: image }} />

					<div className={classNames(classes.overlay)}>
						<div className={classNames(classes.overlayIcon)}>
							{icon2}
						</div>
					</div>

				</div>
			</ButtonBase>
			{props.children}
		</Card>
	)
}

export default withStyles(styles)(ListItem)
