
// Include RactRouter Module
"use strict";

var Router = ReactRouter.create();
var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;

// Application Frame
var App = React.createClass({
	displayName: "App",

	render: function render() {
		return React.createElement(RouteHandler, null);
	}
});

var Player = React.createClass({
	displayName: "Player",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "player", key: this.props.path },
			React.createElement(
				"h1",
				null,
				"Player"
			),
			React.createElement(
				"div",
				{ className: "stage" },
				React.createElement("video", {
					src: "/playlist/" + this.props.params.path,
					width: "100%", autoPlay: true, controls: true })
			)
		);
	}
});

var Folder = React.createClass({
	displayName: "Folder",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "list-item folder", key: this.props.path },
			React.createElement(
				"div",
				{ className: "left" },
				React.createElement("span", { className: "glyphicon glyphicon-folder-open", "aria-hidden": "true" })
			),
			React.createElement(
				"div",
				{ className: "right" },
				React.createElement(
					Link,
					{ to: "list", params: { "path": encodeURIComponent(this.props.path) } },
					this.props.name
				)
			)
		);
	}
});

var Video = React.createClass({
	displayName: "Video",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "list-item video", key: this.props.path },
			React.createElement(
				"div",
				{ className: "left" },
				React.createElement(
					Link,
					{ to: "play", params: { "path": encodeURIComponent(this.props.path) } },
					React.createElement("img", { src: "/frame/" + this.props.path })
				)
			),
			React.createElement(
				"div",
				{ className: "right" },
				this.props.name
			)
		);
	}
});

var List = React.createClass({
	displayName: "List",

	getInitialState: function getInitialState() {
		return {
			"videos": [],
			"folders": []
		};
	},

	fetchData: function fetchData(path) {
		var _this = this;

		$.get("/list/" + path, function (data) {
			_this.setState({
				"folders": data.folders,
				"videos": data.videos
			});
		});
	},

	componentDidMount: function componentDidMount() {
		var path = this.props.params.path || "";
		this.fetchData(path);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var path = nextProps.params.path || "";
		this.fetchData(path);
	},

	render: function render() {
		var folders = this.state.folders.map(function (folder) {
			return React.createElement(Folder, { name: folder.name, path: folder.path });
		});
		var videos = this.state.videos.map(function (video) {
			return React.createElement(Video, { name: video.name, path: video.path });
		});
		return React.createElement(
			"div",
			{ className: "container" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-12 list-items" },
					folders,
					videos
				)
			)
		);
	}
});

var routes = React.createElement(
	Route,
	{ path: "/ui/", handler: App },
	React.createElement(DefaultRoute, { handler: List }),
	React.createElement(Route, { name: "list", path: "list/:path", handler: List }),
	React.createElement(Route, { name: "play", path: "play/:path", handler: Player })
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Root) {
	React.render(React.createElement(Root, null), document.getElementById("app"));
});