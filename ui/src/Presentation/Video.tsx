import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MovieIcon from '@mui/icons-material/Movie';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import moment from 'moment';
import * as React from 'react';
import Duration from './Duration';
import ListItem from './ListItem';
import ListItemDetails from './ListItemDetails';

function Actions(props) {
	const downloadsPath = "/api/download/" + props.path
	return (
		<CardActions {...props}>
			<Button
				size="small"
				variant="text"
				target="_blank"
				href={downloadsPath}>
				<SaveIcon /> &nbsp; Download
			</Button>
		</CardActions>
	)
}

export default function Video(props) {
	const time = Math.min(30.0, Math.ceil(props.info.duration * 0.1))
	const image = "url('/api/frame/" + props.path + "?t=" + time + "')"
	const playLink = "/play/" + props.path
	return (
		<ListItem
			to={playLink}
			icon={MovieIcon}
			actionIcon={PlayIcon}
			image={image} >

			<ListItemDetails title={props.name} to={playLink}>
				<Typography color="textSecondary">
					
					<span style={{ marginRight: '0.25em' }}><AccessTimeIcon style={{ fontSize: 'inherit', 'verticalAlign': 'middle' }} /></span>
					<span style={{ verticalAlign: 'middle' }}><Duration duration={props.info.duration} /></span><br />

					<span style={{ marginRight: '0.25em' }}><DateRangeIcon style={{ fontSize: 'inherit', 'verticalAlign': 'middle' }} /></span>
					<span style={{ verticalAlign: 'middle' }}>{moment(props.info.lastModified).format("MMM DD YYYY, hh:mm")}</span>

				</Typography>
			</ListItemDetails>

			<Actions style={{
				bottom: '0',
				left: '0',
				position: 'absolute',
				right: '0'
			}} {...props} />
			<Actions style={{
				visibility: 'hidden'
			}} {...props} />

		</ListItem >
	);
}
