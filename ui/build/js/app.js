
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

// Application Frame
var App = React.createClass({
	displayName: "App",

	render() {
		return React.createElement(
			"div",
			null,
			this.props.children
		);
	}
});

var Player = React.createClass({
	displayName: "Player",


	componentDidMount() {
		this.video = ReactDOM.findDOMNode(this._video);
		this.player = videojs(this.video);
		this.player.play();
	},

	componentWillUnmount() {
		// TODO: Fix to use promises
		this.player.dispose();
		/*
  this.video.pause();
  this.video.src = "";
  this.video.play().then(() => {
  	try {
  		this.video.pause();
  	} catch (e) {}
  });
  */
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
				React.createElement(
					"video",
					{
						className: "video-js vjs-default-skin vjs-16-9 vjs-big-play-centered",
						ref: c => this._video = c,
						width: "100%", controls: true },
					React.createElement("source", {
						src: "/playlist/" + this.props.params.splat,
						type: "application/x-mpegURL" })
				)
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
			{ to: "/list/" + this.props.path },
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

const Duration = props => {
	function pad(str) {
		var pad = "00";
		return pad.substring(0, pad.length - str.length) + str;
	}
	let time = parseInt(props.duration);
	let hours = Math.floor(time / 3600);
	let minutes = Math.floor((time - hours * 3600) / 60);
	let seconds = time - hours * 3600 - minutes * 60;
	return React.createElement(
		"span",
		null,
		pad(hours),
		"h",
		pad(minutes),
		"m",
		pad(seconds),
		"s"
	);
};

var Video = React.createClass({
	displayName: "Video",

	render() {
		return React.createElement(
			Link,
			{ to: "/play/" + this.props.path },
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
					React.createElement(
						"p",
						null,
						this.props.name
					),
					React.createElement(
						"p",
						{ className: "video-info" },
						React.createElement("span", { className: "glyphicon glyphicon-time" }),
						" ",
						React.createElement(Duration, { duration: this.props.info.duration }),
						"\xA0| ",
						moment(this.props.info.lastModified).format("MMM DD YYYY, hh:mm")
					)
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
			videos = this.state.videos.map(video => React.createElement(Video, { name: video.name, info: video.info, path: video.path, key: video.name }));
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

videojs.Hls.xhr.beforeRequest = function (options) {
	options.timeout = 30000;
	return options;
};

const h = ReactRouter.useRouterHistory(History.createHistory)({
	basename: '/ui'
});

ReactDOM.render(React.createElement(
	Router,
	{ history: h },
	React.createElement(
		Route,
		{ component: App },
		React.createElement(Route, { name: "list", path: "list/*", component: List }),
		React.createElement(Route, { name: "play", path: "play/*", component: Player }),
		React.createElement(Route, { path: "*", component: List })
	)
), document.getElementById('app'));