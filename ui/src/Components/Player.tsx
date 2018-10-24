
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';

import * as videojs from 'video.js';
import 'video.js/dist/video-js.css'

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

	public render() {
		const { classes } = this.props;
		const path = this.props.match.params[0];
		const name = path.substring(path.lastIndexOf("/") + 1);
		const parent = path.substring(0, path.lastIndexOf("/"));
		return (
			<div className="player" key={path}>
				<AppBar >
					<Toolbar>
						<IconButton color="inherit" component={Link}
							// @ts-ignore
							to={'/list/' + parent} aria-label="Menu">
							<BackIcon />
						</IconButton>
						<Typography className={classNames(classes.title)} variant="title" color="inherit" >
							{name}
						</Typography>
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
