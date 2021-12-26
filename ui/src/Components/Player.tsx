import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import BackButton from '../Presentation/BackButton';
import Page from './Page';
import { useParams } from 'react-router';

const titleStyles = {
	flexGrow: 1,
	marginLeft: '24px'
}

const videoStyles = {
	boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
	margin: '0 auto',
	width: 'calc(90vh * 1.77 - 100px)',
}

const stageStyles = {
	alignItems: 'center',
	display: 'flex',
	flexBasis: 'fit-content',
	height: '100vh',
	justifyItems: 'center',
	padding: '20px',
	paddingTop: '80px',
}

export default function Player(props) {
	const params = useParams()
	return <Player2 params={params}  {...props} />
}
class Player2 extends Page<any, any> {

	private video: any
	private videoRef: any
	private player: any

	public componentDidUpdate() {
		this.video = ReactDOM.findDOMNode(this.videoRef);
		if (this.video) {
			// this.video.setAttribute('x-webkit-airplay','allow');
			// this.video.setAttribute('airplay','allow');
			this.player = videojs(this.video, {
        playbackRates: [0.5, 1, 1.5, 2],
			});
      this.player.play();
		}
	}

	public componentWillUnmount() {
		this.player.dispose();
	}

	public fetch(props) {
		const path = props.params.path;
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
		const path = this.props.params.path;
		return "/api/download/" + path
	}

	toolbar() {
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
				<Typography variant="h6" sx={titleStyles} color="inherit" >
					{this.state.video.name}
				</Typography>
				<div>
          <IconButton
              component={Link}
              to={"/play/"+this.state.video.prev}
              disabled={this.state.video.prev===""}
              size="large">
						<SkipPreviousIcon />
					</IconButton>
          <IconButton
              component={Link}
              to={"/play/"+this.state.video.next}
              disabled={this.state.video.next===""}
              size="large">
						<SkipNextIcon />
					</IconButton>
					<IconButton
                        aria-owns={open ? 'download-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        size="large">
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
        );
	}

	public content() {
		const path = this.props.params.path;
		return (
			<Box sx={stageStyles}>
				<Box sx={videoStyles}>
					<video
						className="video-js vjs-default-skin vjs-16-9  vjs-big-play-centered vjs-playback-rate"
						ref={(c) => this.videoRef = c}
						width="100%" controls={true} >
						<source
							src={"/api/playlist/" + path}
							type="application/x-mpegURL" />
					</video>
				</Box>
			</Box>
		)
	}

}

