
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
	render() {
		return (
			<div className="player" key={this.props.path}>
				<h1>Player</h1>
				<div className="stage">
					<video
						src={"/playlist/" + this.props.params.splat}
						width="100%"  autoPlay controls >
					</video>	
				</div>
				
			</div>
		)
	}
})

var Folder = React.createClass({
	render() {
		return (
			<div className="list-item folder" key={this.props.path}>
				<div className="left">
					<span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
				</div>
				<div className="right">
					<Link to="list" params={{"splat": this.props.path}} >
						{this.props.name}
					</Link>
				</div>
			</div>
		)
	}
})

var Video = React.createClass({
	render() {
		return (
			<div className="list-item video" key={this.props.path}>
				<div className="left">
					<Link to="play" params={{"splat": this.props.path}} >
						<img src={"/frame/" + this.props.path} />
					</Link>
				</div>
				<div className="right">
					{this.props.name}
				</div>
			</div>
		)
	}
})

var List = React.createClass({

	getInitialState() {
		return {
			'videos': [],
			'folders': []
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
		var folders = this.state.folders.map((folder) => <Folder name={folder.name} path={folder.path} />)
		var videos = this.state.videos.map((video) => <Video name={video.name} path={video.path} />)
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12 list-items">
						{folders}
						{videos}
					</div>
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