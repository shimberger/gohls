
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

function getParent(path) {
	let paths = path.split("/")
	return (paths.length >= 2) ? "/" + _.join(_.take(paths,paths.length-1),"/") : "/"
}

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

	componentDidMount() {
		this.video = ReactDOM.findDOMNode(this._video);
		$(this.video).attr('x-webkit-airplay','allow');
		$(this.video).attr('airplay','allow');
		this.player = videojs(this.video,{
			//plugins: { airplayButton: {} }
		});
		this.player.play();
	},

	componentWillUnmount() {
		this.player.dispose();
	},

	render() {
		let path = this.props.params.splat;
		return (
			<div className="player" key={path}>
				<div className="stage">
					<video
						className="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered"
						ref={(c) => this._video = c}
						width="100%" controls >
						<source
    						src={"/playlist/720/" + path }
             				type="application/x-mpegURL" />
					</video>
				</div>
				<Link to={getParent(path)} className="back">
					<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
				</Link>
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
		let time = Math.min(30.0,Math.ceil(this.props.info.duration * 0.1))
		return (
			<Link to={"/play/" + this.props.path} >
				<div className="list-item video" key={this.props.path}>
					<div className="left">
						<div className="frame" style={{"backgroundImage": "url('/frame/" + this.props.path+"?t="+time+"')"}} >
							<div className="inner">
								<span className="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
							</div>
						</div>
					</div>
					<div className="right">
						<p>
							{this.props.name}&nbsp;
							(<a onClick={(e) => {e.preventDefault(); window.location = "/download/" + this.props.path}} target="_blank">Download</a>)
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
				<header className="header">
					<div className="header-content">
						<div className="header-left">
							<Link to={getParent(this.props.params.splat)}>
								<span className="glyphicon glyphicon-circle-arrow-left"/>
							</Link>
						</div>
						<div className="header-center">
							{"/" + this.props.params.splat || "/"}
						</div>
						<div className="header-right">

						</div>
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
});

videojs.Hls.xhr.beforeRequest = function(options) {
	options.timeout = 30000;
	return options;
};

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
