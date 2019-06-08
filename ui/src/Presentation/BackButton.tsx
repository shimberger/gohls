import * as React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ChevronLeft';

export default function BackButton(props) {
	return (
		// @ts-ignore
		<IconButton color="inherit" component={Link}
			// @ts-ignore
			to={props.to} aria-label="Menu">
			<BackIcon />
		</IconButton>
	)
}
