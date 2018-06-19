

import * as React from 'react';
import { Link } from "react-router-dom";

import * as moment from 'moment';

import Duration from './Duration'

class Video extends React.Component<any, any> {

	constructor( props ){
		super( props );
	  }

    public render(): any {
		const time = Math.min(30.0,Math.ceil(this.props.info.duration * 0.1))
		return (
			<Link to={"/play/" + this.props.path} >
				<div className="list-item video" key={this.props.path}>
					<div className="left">
						<div className="frame" style={{"backgroundImage": "url('/api/frame/" + this.props.path+"?t="+time+"')"}} >
							<div className="inner">
								<span className="glyphicon glyphicon-play-circle" aria-hidden="true"/>
							</div>
						</div>
					</div>
					<div className="right">
						<p>
							{this.props.name}&nbsp;
							(<a href={ "/api/download/" + this.props.path} target="_blank">Download</a>)
						</p>
						<p className="video-info">
							<span className="glyphicon glyphicon-time"/> <Duration duration={this.props.info.duration} />
							&nbsp;| {moment(this.props.info.lastModified).format("MMM DD YYYY, hh:mm")}
						</p>
					</div>
				</div>
			</Link>
		)
	}
}
  
export default Video;