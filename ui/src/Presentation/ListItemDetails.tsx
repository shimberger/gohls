import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";
import formatTitle from '../formatTitle';

export default function ListItemDetails(props) {
	return (
		<CardContent>
			<div style={{ overflow: 'hidden', maxWidth: '100%' }}>
				<Link style={{
					textDecoration: 'none',
					color: 'white'
				}} to={props.to}>
					<Typography gutterBottom={true} variant="h5" component="h3">
						{formatTitle(props.title)}
					</Typography>
				</Link>
				{props.children}
			</div>
		</CardContent>
	)
}
