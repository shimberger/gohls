
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ChevronLeft';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classNames from 'classnames';

import 'video.js/dist/video-js.css';

import videojs from 'video.js'


const styles = {
	root: {
		flexGrow: 1,
	},
	stage: {
		alignItems: 'center',
		display: 'flex',
		flexBasis: 'fit-content',
		height: '100vh',
		justifyItems: 'center',
		padding: '20px',
		paddingTop: '80px',
	},
	title: {
		flexGrow: 1,
		marginLeft: '24px'
	},
	video: {
		boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
		margin: '0 auto',
		width: 'calc(90vh * 1.77 - 100px)',
	},
};

class Player extends React.Component<any, any> {

	private video: any
	private videoRef: any
	private player: any

	public componentDidMount() {
		this.video = ReactDOM.findDOMNode(this.videoRef);
		// this.video.setAttribute('x-webkit-airplay','allow');
		// this.video.setAttribute('airplay','allow');
		this.player = videojs(this.video, {

		});
		this.player.play();
	}

	public componentWillUnmount() {
		this.player.dispose();
	}

	state = {
		anchorEl: null,
		openDialog: false,
		start: '0',
		duration: '60',
	};
	
	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};
	
	handleDownload = () => {
		this.setState({ anchorEl: null });
	};

	handleClip = () => {
		this.setState({ openDialog: true, anchorEl: null });
	};

	handleClose = () => {
		this.setState({ openDialog: false });
	};

	handleChange = name => event => {
		this.setState({
		  [name]: event.target.value,
		});
	};

	public render() {
		const { classes } = this.props;
		const path = this.props.match.params[0];
		const name = path.substring(path.lastIndexOf("/") + 1);
		const parent = path.substring(0, path.lastIndexOf("/"));
		const { anchorEl, openDialog, start, duration } = this.state;
		const open = Boolean(anchorEl);
		const downloadsPath = "/api/download/" + path
		const clipPath = downloadsPath + "?start=" + start + "&duration=" + duration

		const clipDialog = 
			<Dialog
				open={openDialog}
				onClose={this.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Download video clip"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Enter the starting position and duration of the clip in seconds:
					</DialogContentText>
					<TextField
						label="Start at"
						value={start}
						autoFocus={true}
						onChange={this.handleChange('start')}
					/>
					<TextField
						label="Duration"
						value={duration}
						onChange={this.handleChange('duration')}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="primary">
						Cancel
					</Button>
					<Button 
						onClick={this.handleClose} 
						color="primary" 
						target="_blank"
						href={clipPath}
					>
						Download
					</Button>
				</DialogActions>
			</Dialog>

		const downloadMenu = 
			<div>
				<IconButton
					aria-owns={open ? 'download-menu' : null}
					aria-haspopup="true"
					onClick={this.handleMenu}
				>
					<MoreVertIcon />
				</IconButton>
				<Menu
					id="download-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={this.handleDownload}
				>
					<MenuItem onClick={this.handleDownload}>
						<Button target="_blank" href={downloadsPath}>
							Download video
						</Button>
					</MenuItem>
					<MenuItem onClick={this.handleClip}>
						<Button>Download clip</Button>
					</MenuItem>
				</Menu>
			</div>

		return (
			<div className="player" key={path}>
				<AppBar >
					<Toolbar>
						<IconButton color="inherit" component={Link}
							// @ts-ignore
							to={'/list/' + parent} aria-label="Menu">
							<BackIcon />
						</IconButton>
						<Typography className={classNames(classes.title)} variant="h6" color="inherit" >
							{name}
						</Typography>
						{downloadMenu}
						{clipDialog}
					</Toolbar>
				</AppBar>
				<div className={classNames(classes.stage)}>
					<div className={classNames(classes.video)}>
						<video
							className="video-js vjs-default-skin vjs-16-9  vjs-big-play-centered"
							ref={(c) => this.videoRef = c}
							width="100%" controls={true} >
							<source
								src={"/api/playlist/" + path}
								type="application/x-mpegURL" />
						</video>
					</div>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Player)
