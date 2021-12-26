import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { InputAdornment } from '@mui/material';
import Typography from '@mui/material/Typography';
import { orderBy } from 'lodash';
import * as React from 'react';
import BackButton from '../Presentation/BackButton';
import Folder from '../Presentation/Folder';
import ListMessage from '../Presentation/ListMessage';
import Video from '../Presentation/Video';
import Page from './Page';
import { Search as SearchIcon } from "@mui/icons-material"
import { useParams } from 'react-router';

const titleStyles = {
	marginLeft: '24px',
	overflow: 'hidden',
	whiteSpace: 'nowrap' as const,
}

export default function List(props) {
	const params = useParams()
	return <List2 params={params} {...props} />
}

class List2 extends Page<any, any> {

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
		const path = props.params.path || "";
		this.setState(this.getInitialState())
		return fetch('/api/item/' + path).then((response) => {
			return response.json()
		}).then((data) => {
			return new Promise((resolve) => {
				let folders = data.children.filter(c => c.type === 'folder')
				let videos = data.children.filter(c => c.type === 'video')
				resolve({
					'folders': orderBy(folders, 'name', 'asc'),
					'name': data.name,
					'parents': data.parents,
					'path': data.path,
					'videos': orderBy(videos, 'name', 'asc')
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
		const back = (this.state.parents[0]) ? <BackButton to={"/list/" + this.state.parents[0].path} /> : null
		return (
			<React.Fragment>
				{back}
				<Typography variant="h6" sx={titleStyles} color="inherit" >
					{this.state.name}
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
				<div>
					<TextField
						size="small"
						value={this.state.search}
						placeholder="Search…"
						onChange={this.onSearch}
						InputProps={{
							startAdornment: (
								< InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							)
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
			<div style={{ padding: 20, paddingTop: '84px', flexGrow: 1 }}>
				<Grid spacing={4} container={true} alignItems="stretch">
					{folders}
					{videos}
					{empty}
				</Grid>
			</div >
		)
	}

}
