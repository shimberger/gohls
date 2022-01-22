import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import * as React from 'react';
import { Link } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import BackButton from '../Presentation/BackButton';
import { useParams } from 'react-router';
import ClipDialog from '../Presentation/ClipDialog';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import ListMessage from '../Presentation/ListMessage';

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

const VideoJS = (props) => {

	const videoRef = React.useRef(null);
	const playerRef = React.useRef(null);
	const { options, onReady } = props;

	React.useEffect(() => {
		// make sure Video.js player is only initialized once
		if (!playerRef.current) {
			const videoElement = videoRef.current;
			if (!videoElement) return;

			const player = playerRef.current = videojs(videoElement, options, () => {
				//console.log("player is ready");
				onReady && onReady(player);
			});
		} else {
			// you can update player here [update player through props]
			const player = playerRef.current;
			// player.autoplay(options.autoplay);
			player.src(options.sources);
		}
	}, [options, videoRef, onReady]);

	// Dispose the Video.js player when the functional component unmounts
	React.useEffect(() => {
		const player = playerRef.current;

		return () => {
			if (player) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [playerRef]);

	return (
		<div data-vjs-player>
			<video width="100%" controls={true} ref={videoRef} className="video-js vjs-default-skin vjs-16-9  vjs-big-play-centered vjs-playback-rate" />
		</div>
	);
}

function VideoToolbar({ data, path }) {

	const handleMenu = event => {
		setAnchorEL(event.currentTarget);
	};

	const handleReset = () => {
		setAnchorEL(null);
	};

	const handleClip = () => {
		setDialog(true)
	};

	const handleDownload = () => {
		window.open(downloadsPath(), '_blank');
		setDialog(false)
		setAnchorEL(null);
	};

	const handleClose = () => {
		setDialog(false)
	};

	function downloadsPath() {
		return "/api/download/" + path
	}

	const [openDialog, setDialog] = React.useState(false)
	const [anchorEl, setAnchorEL] = React.useState(null)


	const open = Boolean(anchorEl);
	const clipDialog = <ClipDialog
		open={openDialog}
		onClose={() => handleClose()}
		onDownload={(start, duration) => {
			const clipPath = downloadsPath() + "?start=" + start + "&duration=" + duration
			window.open(clipPath, '_blank');
			setAnchorEL(false)
			setDialog(false)
		}}
	/>
	return (
		<React.Fragment>
			{clipDialog}
			<BackButton to={"/list/" + data.parents[0].path} />
			<Typography variant="h6" sx={titleStyles} color="inherit" >
				{data.video.name}
			</Typography>
			<Box sx={{ flexShrink: 0 }}>
				<IconButton
					component={Link}
					to={"/play/" + data.video.prev}
					disabled={data.video.prev === ""}
					size="large">
					<SkipPreviousIcon />
				</IconButton>
				<IconButton
					component={Link}
					to={"/play/" + data.video.next}
					disabled={data.video.next === ""}
					size="large">
					<SkipNextIcon />
				</IconButton>
				<IconButton
					aria-owns={open ? 'download-menu' : null}
					aria-haspopup="true"
					onClick={handleMenu}
					size="large">
					<MoreVertIcon />
				</IconButton>
				<Menu
					id="download-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleReset}
				>
					<MenuItem onClick={handleDownload}>
						Download Video
					</MenuItem>
					<MenuItem onClick={handleClip}>
						Download Clip
					</MenuItem>
				</Menu>
			</Box>
		</React.Fragment>
	)
}

export default function Player(props) {
	const params = useParams()
	const path = params.path;

	const [data, setData] = React.useState(null)

	React.useEffect(() => {
		fetch('/api/item/' + path)
			.then((response) => {
				response.json().then((data) => {
					setData({
						'parents': data.parents,
						'video': data,
					})
				})
			});
	}, [path])

	const videoJsOptions = { // lookup the options in the docs for more options
		autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		playbackRates: [0.5, 1, 1.5, 2],
		sources: [{
			src: "/api/playlist/" + path,
			type: "application/x-mpegURL"
		}]
	}

	return (
		<div className="page" key="">
			<AppBar >
				<Toolbar>
					{(data) ? <VideoToolbar path={params.path} data={data} /> : null}
				</Toolbar>
			</AppBar>
			<div>
				{(!data) ? <ListMessage><CircularProgress size={50} /></ListMessage> : (
					<Box sx={stageStyles}>
						<Box sx={videoStyles}>
							<VideoJS options={videoJsOptions} />
						</Box>
					</Box>
				)}
			</div>
		</div>
	)
}

