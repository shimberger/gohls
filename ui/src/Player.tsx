
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

import getParent from './getParent'

import * as videojs from 'video.js';

import './Player.css';

import 'video.js/dist/video-js.css'

/*
videojs.Hls.xhr.beforeRequest = (options) => {
	options.timeout = 30000;
	return options;
};
*/

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
		const path = this.props.match.params[0];
		return (
			<div className="player" key={path}>
				<div className="stage">
					<video
						className="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered"
						ref={(c) => this.videoRef = c}
						width="100%" controls={true} >
						<source
    						src={"/api/playlist/720/" + path }
             				type="application/x-mpegURL" />
					</video>
				</div>
				<Link to="/list/" className="back">
					<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"/>
				</Link>
			</div>
		)
	}
}
  
export default Player;