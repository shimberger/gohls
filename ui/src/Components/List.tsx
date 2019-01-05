import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import BackIcon from '@material-ui/icons/ChevronLeft';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import Folder from './Folder';
import getParent from '../getParent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import ListMessage from './ListMessage';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Video from './Video';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { orderBy } from 'lodash';

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

class List extends React.Component<any, any> {

	constructor(props: any) {
		super(props)
		this.state = {
			'folders': null,
			'videos': null,
			'search': ''
		}
	}


	public fetchData(path) {
		this.setState({
			'folders': null,
			'name': null,
			'search': '',
			'path': null,
			'parents': null,
			'videos': null
		})
		fetch('/api/list/' + path).then((response) => {
			response.json().then((data) => {
				window.setTimeout(() => {
					this.setState({
						'folders': orderBy(data.folders, 'name', 'asc'),
						'name': data.name,
						'parents': data.parents,
						'path': data.path,
						'videos': orderBy(data.videos, 'name', 'asc')
					})
				}, 0)

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

	public componentDidMount() {
		const path = this.props.match.params[0] || "";
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
			folders = this.filter(this.state.folders).map((folder) => <Grid key={folder.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Folder name={folder.name} path={folder.path} /></Grid>)
			videos = this.filter(this.state.videos).map((video) => <Grid key={video.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Video name={video.name} info={video.info} path={video.path} /></Grid>)
		}

		const back = (this.state.parents && this.state.parents.length > 0) ? (
			<IconButton color="inherit" component={Link}
				// @ts-ignore
				to={"/list/" + this.state.parents[0].path} aria-label="Menu">
				<BackIcon />
			</IconButton>
		) : null

		const name = (this.state.name) ? (
			<Typography variant="h6" className={classNames(classes.title)} color="inherit" >
				{this.state.name}
			</Typography>
		) : null

		const empty = (this.state.folders != null && (videos.length + folders.length) === 0) ? <ListMessage>No folders or videos found</ListMessage> : null
		return (
			<div className="list">

				<AppBar >
					<Toolbar>
						{back}
						{name}
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

}

export default withStyles(styles)(List);
