
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

// Application Frame
var App = React.createClass({
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
});

var Player = React.createClass({

	// HLS.js doesn't seem to work somehow'

	componentDidMount() {
			this.video = ReactDOM.findDOMNode(this._video);
			this.player = videojs(this.video,{
				hls: {

				}
			});
			videojs.Hls.xhr.beforeRequest = function(options) {
				options.timeout = 30000;
				return options;
			};
			this.player.src({
            	src: "/playlist/" + this.props.params.splat,
            	type: 'application/x-mpegURL'
          	});

			/*
			this.hls = new Hls({
				debug: true,
		      	fragLoadingTimeOut: 60000,

			});
			let hls = this.hls;
			let props = this.props;
			hls.attachMedia(video);
			hls.on(Hls.Events.ERROR, function (event, data) {
				console.log(data);
			})
			hls.on(Hls.Events.MEDIA_ATTACHED, function () {
				console.log("video and hls.js are now bound together !");
				hls.loadSource("/playlist/" + props.params.splat);
				hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
					console.log(data)
					console.log("manifest loaded, found " + data.levels.length + " quality level");
					video.play();
				});
			});
			*/
	},

	componentWillUnmount() {
		//this.hls.detachMedia()
	},


	componentWillUnmount() {
		this.pauseVideo();
		//	this.hls.detachMedia()
	},

	pauseVideo() {
		// TODO: Fix to use promises
		this.player.pause();
		this.video.pause();
		this.video.src = "";
		this.video.play();
		this.video.pause();
	},

	goBack(e) {
		e.preventDefault();
		window.history.back();
	},

	render() {
		return (
			<div className="player" key={this.props.path}>
				<div className="stage">
					<video
						className="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered" controls="controls"
						ref={(c) => this._video = c}
						width="100%" controls autoPlay >
					</video>
				</div>
					<a href="#" onClick={this.goBack} className="back">
						<span className="glyphicon glyphicon-chevron-left" aria-hidden="true">
					</span>
				</a>
			</div>
		)
	}
})

var Folder = React.createClass({
	render() {
		return (
			<Link to={"/list/" + this.props.path }  >
				<div className="list-item folder" key={this.props.path}>
					<div className="left">
						<div className="frame">
							<div className="inner">
								<span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
							</div>
						</div>
					</div>
					<div className="right">
						{this.props.name}
					</div>
				</div>
			</Link>
		)
	}
})

var Loader = React.createClass({
	render() {
		return (
			<div className="loader">
				<img width="30" height="30" src="/ui/assets/img/loader.svg" />
			</div>
		)
	}
})

var EmptyMessage = React.createClass({
	render() {
		return (
			<div className="empty-message">
				<p>No folders or videos found in folder :-(</p>
			</div>
		)
	}
})



const Duration = (props) => {
	function pad(str) {
		var pad = "00"
		return pad.substring(0, pad.length - str.length) + str
	}
	let time = parseInt(props.duration)
	let hours = Math.floor(time / 3600)
	let minutes = Math.floor((time - hours * 3600) / 60)
	let seconds = (time - hours * 3600 - minutes * 60)
	return (
		<span>
			{pad(hours)}h{pad(minutes)}m{pad(seconds)}s
		</span>
	);
}

var Video = React.createClass({
	render() {
		return (
			<Link to={"/play/" + this.props.path} >
				<div className="list-item video" key={this.props.path}>
					<div className="left">
						<div className="frame" style={{"backgroundImage": "url('/frame/" + this.props.path+"')"}} >
							<div className="inner">
								<span className="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
							</div>
						</div>
					</div>
					<div className="right">
						<p>{this.props.name}</p>
						<p className="video-info">
							<span className="glyphicon glyphicon-time"/> <Duration duration={this.props.info.duration} />
							&nbsp;| {moment(this.props.info.lastModified).format("MMM DD YYYY, hh:mm")}
						</p>
					</div>
				</div>
			</Link>
		)
	}
})

var List = React.createClass({

	getInitialState() {
		return {
			'videos': null,
			'folders': null
		}
	},

	fetchData(path) {
		this.setState({
			'folders': null,
			'videos': null
		})
		$.get('/list/' + path,(data) => {
			this.setState({
				'folders': data.folders,
				'videos': data.videos
			})
		});
	},

	componentDidMount() {
		var path = this.props.params.splat || "";
		console.log(this.props);
		this.fetchData(path)
	},

	componentWillReceiveProps(nextProps) {
		var path = nextProps.params.splat || "";
		this.fetchData(path)
	},

	render () {
		let loader = (!this.state.folders) ? <Loader/> : null;
		let folders = []
		let videos = []
		if (this.state.folders) {
			folders = this.state.folders.map((folder) => <Folder key={folder.name} name={folder.name} path={folder.path} />)
			videos = this.state.videos.map((video) => <Video name={video.name} info={video.info} path={video.path} key={video.name} />)
		}
		let empty = (this.state.folders != null && (videos.length + folders.length) == 0) ? <EmptyMessage/> : null
		return (
			<div className="list">
					<div className="list-items">
						{loader}
						{folders}
						{videos}
						{empty}
					</div>
			</div>
		)
	}
});

const h = ReactRouter.useRouterHistory(History.createHistory)({
  basename: '/ui'
})

ReactDOM.render((
	<Router history={h} >
		<Route component={App}>
			<Route name="list" path="list/*"  component={List} />
			<Route name="play" path="play/*"  component={Player} />
			<Route path="*" component={List}/>
		</Route>
	</Router>
), document.getElementById('app'));
