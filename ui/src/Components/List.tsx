import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { InputAdornment } from '@mui/material';
import Typography from '@mui/material/Typography';
import { orderBy } from 'lodash';
import * as React from 'react';
import { useState, useEffect } from 'react';
import BackButton from '../Presentation/BackButton';
import Folder from '../Presentation/Folder';
import Video from '../Presentation/Video';
import { Search as SearchIcon } from "@mui/icons-material"
import { useParams } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import ListMessage from '../Presentation/ListMessage';

const titleStyles = {
	marginLeft: '24px',
	overflow: 'hidden',
	whiteSpace: 'nowrap' as const,
}

function Loading() {
	return (
		<ListMessage><CircularProgress size={50} /></ListMessage>
	)
}

export default function List(props) {
	const params = useParams()
	const [isLoading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [data, setData] = useState({
		'folders': null,
		'name': null,
		'path': null,
		'parents': null,
		'videos': null
	})
	useEffect(() => {
		setLoading(true)
		const path = params.path || "";
		fetch('/api/item/' + path).then((response) => {
			return response.json()
		}).then((data) => {
			return new Promise((resolve) => {
				let folders = data.children.filter(c => c.type === 'folder')
				let videos = data.children.filter(c => c.type === 'video')
				setData({
					'folders': orderBy(folders, 'name', 'asc'),
					'name': data.name,
					'parents': data.parents,
					'path': data.path,
					'videos': orderBy(videos, 'name', 'asc')
				});
				setLoading(false)
			})
		});
	}, [params.path])

	function toolbar() {
		const back = (data.parents && data.parents[0]) ? <BackButton to={"/list/" + data.parents[0].path} /> : null
		return (
			<React.Fragment>
				{back}
				<Typography variant="h6" sx={titleStyles} color="inherit" >
					{data.name}
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
				<div>
					<TextField
						size="small"
						value={search}
						placeholder="Search…"
						onChange={onSearch}
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

	function filter(items) {
		if (search) {
			return items.filter(item => item.name.toLowerCase().indexOf(search.toLowerCase()) >= 0)
		}
		return items
	}

	function onSearch(e) {
		setSearch(e.target.value)
	}

	function items() {
		let folders = filter(data.folders).map((folder) => <Grid key={folder.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Folder name={folder.name} path={folder.path} /></Grid>)
		let videos = filter(data.videos).map((video) => <Grid key={video.name} item={true} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}><Video name={video.name} info={video.info} path={video.path} /></Grid>)
		const empty = (data.folders != null && (videos.length + folders.length) === 0) ? <ListMessage>No folders or videos found</ListMessage> : null
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

	return (
		<div className="page" key="">
			<AppBar >
				<Toolbar>
					{(isLoading) ? null : toolbar()}
				</Toolbar>
			</AppBar>
			<div>
				{(isLoading) ? <Loading /> : items()}
			</div>
		</div>
	)
}
