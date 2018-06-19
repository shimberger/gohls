

import getParent from './getParent'

import * as React from 'react';
import { Link } from "react-router-dom";


import EmptyMessage from './EmptyMessage'
import Folder from './Folder'
import Loader from './Loader'
import Video from './Video'

import './List.css';

class List extends React.Component<any, any> {
	
	constructor(props: any) {
		super(props)
		this.state = {
			'folders': null,
			'videos': null
		}
	}


	public fetchData(path) {
		this.setState({
			'folders': null,
			'videos': null
		})
		fetch('/api/list/' + path).then((response) => {
			response.json().then((data) => {
				this.setState({
					'folders': data.folders,
					'videos': data.videos
				})
			})
		});
	}

	public componentDidMount() {
		const path = this.splat() || "";
		this.fetchData(path)
	}

	public componentWillReceiveProps(nextProps) {
		const path = nextProps.match.params[0] || "";
		this.fetchData(path)
	}

	public render (): any {
		const loader = (!this.state.folders) ? <Loader/> : null;

		let folders = []
		let videos = []
		if (this.state.folders) {
			folders = this.state.folders.map((folder) => <Folder key={folder.name} name={folder.name} path={folder.path} />)
			videos = this.state.videos.map((video) => <Video name={video.name} info={video.info} path={video.path} key={video.name} />)
		}
		const empty = (this.state.folders != null && (videos.length + folders.length) === 0) ? <EmptyMessage/> : null
		return (
			<div className="list">
				<header className="header">
					<div className="header-content">
						<div className="header-left">
							<Link to={getParent(this.splat())}>
								<span className="glyphicon glyphicon-circle-arrow-left"/>
							</Link>
						</div>
						<div className="header-center">
							{this.splat() || "/"}
						</div>
						<div className="header-right"/>
					</div>
				</header>
				<div className="">
					<div className="list-items">
						{loader}
						{folders}
						{videos}
						{empty}
					</div>
				</div>
			</div>
		)
	}

	private splat() {
		return this.props.match.params[0]
	}


}
  
export default List;