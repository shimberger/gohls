import * as React from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MovieIcon from '@material-ui/icons/Movie';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import SaveIcon from '@material-ui/icons/Save';

import Duration from './Duration';
import ListItem from './ListItem';
import ListItemDetails from './ListItemDetails';

import * as moment from 'moment';

const styles = {

};

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

function Video(props) {
	const { classes } = props;
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
				<Typography className={classes.pos} color="textSecondary">

					<AccessTimeIcon style={{ fontSize: 'inherit' }} />
					<Duration duration={props.info.duration} /> <br />

					<DateRangeIcon style={{ fontSize: 'inherit' }} />
					{moment(props.info.lastModified).format("MMM DD YYYY, hh:mm")}

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

		</ListItem>
	);
}

export default withStyles(styles)(Video);
