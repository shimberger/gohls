
import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = {
	loader: {
		'& p': {
			fontSize: '2em'
		},
		color: 'white',
		flexGrow: 1,
		padding: '8rem',
		textAlign: 'center',
	},
} as any;

function ListMessage(props) {
	const { classes } = props
	return (
		<div className={classNames(classes.loader)}>
			{props.children}
		</div>
	)
}

export default withStyles(styles)(ListMessage);
