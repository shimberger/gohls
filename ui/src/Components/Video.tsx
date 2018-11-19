import * as React from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField';
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

class Actions extends React.Component<any, any> {
 	public state = {
		duration: '60',
		partial: false,
		start: '0',
	}

	public render() {
		const downloadsPath = "/api/download/" + this.props.path
		const partialDownload = downloadsPath + "?start=" + this.state.start + "&duration=" + this.state.duration
		const {start, duration, partial} = this.state
		const style = {visibility: 'hidden'}
		const startInput = partial ? 
			<TextField
				label="Start at"
				value={start}
				onChange={this.handleChange('start')}
			/> : <label style={{color: 'white'}}>Partial</label>
		const durationInput = partial ?
			<TextField
				label="Duration"
				value={duration}
				onChange={this.handleChange('duration')}
			/> : <label style={{color: 'white'}}>Download</label>
		
		return (
			<CardActions {...this.props}>
				<Button
					size="small"
					variant="text"
					target="_blank"
					href={partial ? partialDownload : downloadsPath}>
					<SaveIcon /> &nbsp; Download
				</Button>
				<Switch
					checked={partial}
					onChange={this.handleSwitchChange('partial')}
					value="partial"
					color="primary"
				/>
				{ startInput }
				{ durationInput }
			</CardActions>
		)
	}

	private handleChange = name => event => {
		this.setState({
		  [name]: event.target.value,
		});
	  };
	
	  private handleSwitchChange = name => event => {
		this.setState({
		  [name]: event.target.checked,
		});
	  };
	
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

export default withStyles(styles)(Video);
