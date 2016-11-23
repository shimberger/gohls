
// Include RactRouter Module
var Router = ReactRouter.create();
var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;

// Application Frame
var App = React.createClass({
	displayName: "App",

	render() {
		return React.createElement(RouteHandler, null);
	}
});

var Player = React.createClass({
	displayName: "Player",


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

	componentWillUnmount() {
		this.pauseVideo();
		//	this.hls.detachMedia()
	},

	pauseVideo() {
		let video = this._video.getDOMNode();
		video.pause();
		video.src = "";
		video.play();
		video.pause();
	},

	goBack(e) {
		e.preventDefault();
		window.history.back();
	},

	render() {
		return React.createElement(
			"div",
			{ className: "player", key: this.props.path },
			React.createElement(
				"div",
				{ className: "stage" },
				React.createElement("video", {
					src: "/playlist/" + this.props.params.splat,
					ref: c => this._video = c,
					width: "100%", controls: true, autoPlay: true })
			),
			React.createElement(
				"a",
				{ href: "#", onClick: this.goBack, className: "back" },
				React.createElement("span", { className: "glyphicon glyphicon-chevron-left", "aria-hidden": "true" })
			)
		);
	}
});

var Folder = React.createClass({
	displayName: "Folder",

	render() {
		return React.createElement(
			Link,
			{ to: "list", params: { "splat": this.props.path } },
			React.createElement(
				"div",
				{ className: "list-item folder", key: this.props.path },
				React.createElement(
					"div",
					{ className: "left" },
					React.createElement(
						"div",
						{ className: "frame" },
						React.createElement(
							"div",
							{ className: "inner" },
							React.createElement("span", { className: "glyphicon glyphicon-folder-open", "aria-hidden": "true" })
						)
					)
				),
				React.createElement(
					"div",
					{ className: "right" },
					this.props.name
				)
			)
		);
	}
});

var Loader = React.createClass({
	displayName: "Loader",

	render() {
		return React.createElement(
			"div",
			{ className: "loader" },
			React.createElement("img", { width: "30", height: "30", src: "/ui/assets/img/loader.svg" })
		);
	}
});

var EmptyMessage = React.createClass({
	displayName: "EmptyMessage",

	render() {
		return React.createElement(
			"div",
			{ className: "empty-message" },
			React.createElement(
				"p",
				null,
				"No folders or videos found in folder :-("
			)
		);
	}
});

var Video = React.createClass({
	displayName: "Video",

	render() {
		return React.createElement(
			Link,
			{ to: "play", params: { "splat": this.props.path } },
			React.createElement(
				"div",
				{ className: "list-item video", key: this.props.path },
				React.createElement(
					"div",
					{ className: "left" },
					React.createElement(
						"div",
						{ className: "frame", style: { "backgroundImage": "url('/frame/" + this.props.path + "')" } },
						React.createElement(
							"div",
							{ className: "inner" },
							React.createElement("span", { className: "glyphicon glyphicon-play-circle", "aria-hidden": "true" })
						)
					)
				),
				React.createElement(
					"div",
					{ className: "right" },
					this.props.name
				)
			)
		);
	}
});

var List = React.createClass({
	displayName: "List",


	getInitialState() {
		return {
			'videos': null,
			'folders': null
		};
	},

	fetchData(path) {
		this.setState({
			'folders': null,
			'videos': null
		});
		$.get('/list/' + path, data => {
			this.setState({
				'folders': data.folders,
				'videos': data.videos
			});
		});
	},

	componentDidMount() {
		var path = this.props.params.splat || "";
		this.fetchData(path);
	},

	componentWillReceiveProps(nextProps) {
		var path = nextProps.params.splat || "";
		this.fetchData(path);
	},

	render() {
		let loader = !this.state.folders ? React.createElement(Loader, null) : null;
		let folders = [];
		let videos = [];
		if (this.state.folders) {
			folders = this.state.folders.map(folder => React.createElement(Folder, { key: folder.name, name: folder.name, path: folder.path }));
			videos = this.state.videos.map(video => React.createElement(Video, { name: video.name, path: video.path, key: video.name }));
		}
		let empty = this.state.folders != null && videos.length + folders.length == 0 ? React.createElement(EmptyMessage, null) : null;
		return React.createElement(
			"div",
			{ className: "list" },
			React.createElement(
				"div",
				{ className: "list-items" },
				loader,
				folders,
				videos,
				empty
			)
		);
	}
});

var routes = React.createElement(
	Route,
	{ path: "/ui/", handler: App },
	React.createElement(DefaultRoute, { handler: List }),
	React.createElement(Route, { name: "list", path: "list/*", handler: List }),
	React.createElement(Route, { name: "play", path: "play/*", handler: Player })
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, Root => {
	React.render(React.createElement(Root, null), document.getElementById('app'));
});