import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import ListMessage from '../Presentation/ListMessage';

export default class Page<P = {}, S = {}, SS = any> extends React.Component<P & any, (S & any), SS> {

	constructor(props: P & any) {
		super(props)
		this.state = Object.assign({
			isPageLoading: true
		}, this.getInitialState(this.props))
	}

	getInitialState(props) {
		return {}
	}

	componentDidMount() {
		this._fetch(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this._fetch(nextProps);
	}

	fetch(props: P & any): Promise<any> {
		return Promise.resolve()
	}

	toolbar() {
		return null
	}

	content() {
		return null
	}

	private _fetch(props: P & any) {
		this.setState({
			isPageLoading: true
		})
		this.fetch(props).then((state) => {
			this.setState(Object.assign({
				isPageLoading: false
			}, state))
		})
	}

	private _toolbar() {
		if (!this.state.isPageLoading) {
			return this.toolbar()
		}
		return null;
	}

	private _content() {
		if (!this.state.isPageLoading) {
			return this.content()
		}
		return <ListMessage><CircularProgress size={50} /></ListMessage>;
	}

	render() {
		return (
			<div className="page" key="">
				<AppBar >
					<Toolbar>
						{this._toolbar()}
					</Toolbar>
				</AppBar>
				<div>
					{this._content()}
				</div>
			</div>
		)
	}

}
