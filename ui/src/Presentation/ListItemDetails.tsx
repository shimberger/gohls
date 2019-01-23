import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import * as React from 'react';
import { Link } from "react-router-dom";
import formatTitle from '../formatTitle';

const styles = {
	link: {
		textDecoration: 'none'
	}
} as any;

function ListItemDetails(props) {
	const { classes } = props
	return (
		<CardContent>
			<div style={{ overflow: 'hidden', maxWidth: '100%' }}>
				<Link className={classNames(classes.link)} to={props.to}>
					<Typography gutterBottom={true} variant="h5" component="h3">
						{formatTitle(props.title)}
					</Typography>
				</Link>
				{props.children}
			</div>
		</CardContent>
	)
}

export default withStyles(styles)(ListItemDetails)
