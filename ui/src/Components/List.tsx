import * as React from 'react';
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';

import getParent from '../getParent'
import Folder from './Folder'
import ListMessage from './ListMessage';
import Video from './Video'

const styles = {
	root: {
		flexGrow: 1,
	},
	title: {
		marginLeft: '24px'
	}
};

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
			'name': null,
			'path': null,
			'videos': null
		})
		fetch('/api/list/' + path).then((response) => {
			response.json().then((data) => {
				window.setTimeout(() => {
					this.setState({
						'folders': data.folders,
						'name': data.name,
						'parents': data.parents,
						'path': data.path,
						'videos': data.videos
					})
				}, 0)

			})
		});
	}

	public componentDidMount() {
		const path = this.splat().path || "";
		this.fetchData(path)
	}

	public componentWillReceiveProps(nextProps) {
		const path = nextProps.match.params[0] || "";
		this.fetchData(path)
	}

	public render(): any {
		const loader = (!this.state.folders) ? <ListMessage><CircularProgress size={50} /></ListMessage> : null;
		const { classes } = this.props;

		let folders = []
		let videos = []
		if (this.state.folders) {
			folders = this.state.folders.map((folder) => <Grid key={folder.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Folder name={folder.name} path={folder.path} /></Grid>)
			videos = this.state.videos.map((video) => <Grid key={video.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Video name={video.name} info={video.info} path={video.path} /></Grid>)
		}
		const empty = (this.state.folders != null && (videos.length + folders.length) === 0) ? <ListMessage>No folders or videos found in folder</ListMessage> : null
		return (
			<div className="list">

				<AppBar >
					<Toolbar>
						<IconButton color="inherit" component={Link}
							// @ts-ignore
							to={getParent(this.splat().path)} aria-label="Menu">
							<BackIcon />
						</IconButton>
						<Typography variant="h6" className={classNames(classes.title)} color="inherit" >
							{this.splat().name}
						</Typography>
					</Toolbar>
				</AppBar>
				<div style={{ padding: 20, paddingTop: '84px' }}>
					<Grid container={true} spacing={40} alignItems="stretch">

						{loader}
						{folders}
						{videos}
						{empty}

					</Grid>

				</div>
			</div>
		)
	}

	private splat() {
		if (!this.state.path) {
			return {
				name: "",
				path: this.props.match.params[0]
			}
		}
		return this.state
	}
}

export default withStyles(styles)(List);
