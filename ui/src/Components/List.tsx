import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import { orderBy } from 'lodash';
import * as React from 'react';
import BackButton from '../Presentation/BackButton';
import Folder from '../Presentation/Folder';
import ListMessage from '../Presentation/ListMessage';
import Video from '../Presentation/Video';
import Page from './Page';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	search: {
		position: 'relative' as 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing.unit * 2,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit * 3,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute' as 'absolute',
		pointerEvents: 'none' as 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	grow: {
		flexGrow: 1,
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	title: {
		marginLeft: '24px',
		overflow: 'hidden',
		whiteSpace: 'nowrap' as 'nowrap',
	}
});

class List extends Page<any, any> {

	getInitialState() {
		return {
			'folders': null,
			'name': null,
			'search': '',
			'path': null,
			'parents': null,
			'videos': null
		}
	}

	public fetch(props) {
		const path = props.match.params[0] || "";
		this.setState(this.getInitialState())
		return fetch('/api/list/' + path).then((response) => {
			return response.json()
		}).then((data) => {
			return new Promise((resolve) => {
				resolve({
					'folders': orderBy(data.folders, 'name', 'asc'),
					'name': data.name,
					'parents': data.parents,
					'path': data.path,
					'videos': orderBy(data.videos, 'name', 'asc')
				});
			})
		});
	}

	public filter(items) {
		if (this.state.search) {
			return items.filter(item => item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0)
		}
		return items
	}

	onSearch = (e) => {
		this.setState({
			search: e.target.value
		})
	}

	public toolbar() {
		const { classes } = this.props;
		const back = (this.state.parents[0]) ? <BackButton to={"/list/" + this.state.parents[0].path} /> : null
		return (
			<React.Fragment>
				{back}
				<Typography variant="h6" className={classNames(classes.title)} color="inherit" >
					{this.state.name}
				</Typography>
				<div className={classes.grow} />
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						value={this.state.search}
						placeholder="Search…"
						onChange={this.onSearch}
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
					/>
				</div>
			</React.Fragment>
		)
	}

	public content() {
		let folders = this.filter(this.state.folders).map((folder) => <Grid key={folder.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Folder name={folder.name} path={folder.path} /></Grid>)
		let videos = this.filter(this.state.videos).map((video) => <Grid key={video.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Video name={video.name} info={video.info} path={video.path} /></Grid>)
		const empty = (this.state.folders != null && (videos.length + folders.length) === 0) ? <ListMessage>No folders or videos found</ListMessage> : null
		return (
			<div style={{ padding: 20, paddingTop: '84px' }}>
				<Grid spacing={4} container={true} alignItems="stretch">
					{folders}
					{videos}
					{empty}
				</Grid>
			</div >
		)
	}

}

export default withStyles(styles)(List);
