import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function ListMessage(props) {
	return (
		<div style={{
			color: 'white',
			flexGrow: 1,
			padding: '8rem',
			textAlign: 'center',
		}}>
			<Typography variant="h5">
				{props.children}
			</Typography>
		</div>
	)
}
