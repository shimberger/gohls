import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import BackButton from '../Presentation/BackButton';
import Page from './Page';

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

class Player extends Page<any, any> {

	private video: any
	private videoRef: any
	private player: any

	public componentDidUpdate() {
		this.video = ReactDOM.findDOMNode(this.videoRef);
		if (this.video) {
			// this.video.setAttribute('x-webkit-airplay','allow');
			// this.video.setAttribute('airplay','allow');
			this.player = videojs(this.video, {

			});
			this.player.play();
		}
	}

	public componentWillUnmount() {
		this.player.dispose();
	}

	public fetch(props) {
		const path = props.match.params[0];
		return fetch('/api/item/' + path)
			.then((response) => {
				return response.json().then((data) => {
					this.setState({
						'parents': data.parents,
						'video': data,
					})
				})
			});
	}

	getInitialState() {
		return {
			anchorEl: null,
			openDialog: false,
			start: '0',
			video: null,
			duration: '60',
		}
	}

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleReset = () => {
		this.setState({ anchorEl: null });
	};

	handleClip = () => {
		this.setState({ openDialog: true, anchorEl: null });
	};

	handleDownload = () => {
		window.open(this.downloadsPath(), '_blank');
		this.setState({ anchorEl: null });
	};

	handleClose = () => {
		this.setState({ openDialog: false });
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	downloadsPath() {
		const path = this.props.match.params[0];
		return "/api/download/" + path
	}

	toolbar() {
		const { classes } = this.props;
		const { anchorEl, openDialog, start, duration } = this.state;
		const open = Boolean(anchorEl);
		const downloadsPath = this.downloadsPath()
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
						Enter the starting position and duration of the clip in seconds.
						<br /><br />
					</DialogContentText>
					<TextField
						label="Start at"
						value={start}
						autoFocus={true}
						onChange={this.handleChange('start')}
					/>
					&nbsp;&nbsp;
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
		return (
			<React.Fragment>
				{clipDialog}
				<BackButton to={"/list/" + this.state.parents[0].path} />
				<Typography variant="h6" className={classNames(classes.title)} color="inherit" >
					{this.state.video.name}
				</Typography>
				<div>
          <IconButton component={Link} to={"/play/"+this.state.video.prev} 
            disabled={this.state.video.prev===""} >
						<SkipPreviousIcon />
					</IconButton>
          <IconButton component={Link} to={"/play/"+this.state.video.next} 
            disabled={this.state.video.next===""} >
						<SkipNextIcon />
					</IconButton>
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
						onClose={this.handleReset}
					>
						<MenuItem onClick={this.handleDownload}>
							Download Video
					</MenuItem>
						<MenuItem onClick={this.handleClip}>
							Download Clip
					</MenuItem>
					</Menu>
				</div>
			</React.Fragment>

		)
	}

	public content() {
		const { classes } = this.props;
		const path = this.props.match.params[0];
		return (
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
		)
	}

}

export default withStyles(styles)(Player)
