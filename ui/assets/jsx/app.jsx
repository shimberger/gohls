
// Include RactRouter Module
var Router = ReactRouter.create();
var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;

// Application Frame
var App = React.createClass({
	render () {
		return (
			<RouteHandler/>
		)
	}
});

var Player = React.createClass({

	// HLS.js doesn't seem to work somehow'
	/*
	componentDidMount() {
		if (Hls.isSupported()) {
			let video = this._video.getDOMNode();
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
		}
	},

	componentWillUnmount() {
		this.hls.detachMedia()
	},
	*/

	goBack(e) {
		e.preventDefault();
		window.history.back();
	},

	render() {
		return (
			<div className="player" key={this.props.path}>
				<div className="stage">
					<video		
						src={"/playlist/" + this.props.params.splat}				
//						ref={(c) => this._video = c}
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
			<Link to="list" params={{"splat": this.props.path}} >
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


var Video = React.createClass({
	render() {
		return (
			<Link to="play" params={{"splat": this.props.path}} >
				<div className="list-item video" key={this.props.path}>
					<div className="left">
						<div className="frame" style={{"backgroundImage": "url('/frame/" + this.props.path+"')"}} >
							<div className="inner">
								<span className="glyphicon glyphicon-play-circle" aria-hidden="true"></span>								
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

var List = React.createClass({

	getInitialState() {
		return {
			'videos': null,
			'folders': null
		}
	},

	fetchData(path) {
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
			videos = this.state.videos.map((video) => <Video name={video.name} path={video.path} key={video.name} />)
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

var routes = (
	<Route path="/ui/" handler={App}>
		<DefaultRoute handler={List}/>
		<Route name="list" path="list/*"  handler={List} />
		<Route name="play" path="play/*"  handler={Player} />
	</Route>
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, (Root) => {
	React.render(<Root/>, document.getElementById('app'));
});