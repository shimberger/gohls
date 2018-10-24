import * as React from 'react';
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router-dom'

import AccountCircle from '@material-ui/icons/FolderShared';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const styles = {

}

class RootSwitch extends React.Component<any, any> {

	public state = {
		anchorEl: null,
	};

	public handleChange = (event, checked) => {
		this.setState({ auth: checked });
	};

	public handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	public handleClose = () => {
		this.setState({ anchorEl: null });
	};

	public itemHandler(root) {
		return (e) => {
			this.handleClose()
			this.props.history.push('/list/' + root.id + '/')
		}
	}

	public menuItems = () => {
		return this.props.roots.map(root => {
			return (
				<MenuItem onClick={this.itemHandler(root)} selected={this.props.root === root.id} key={root.id} >
					{root.title}
				</MenuItem >
			)
		})
	};

	public render() {
		const { anchorEl } = this.state;
		const open = Boolean(anchorEl);
		const selectedRoot = this.props.roots.find(x => x.id === this.props.root)
		return (
			<div style={{ display: "inline-block" }}>
				<Button
					variant="outlined"
					aria-owns={open ? 'menu-appbar' : null}
					aria-haspopup={true}
					onClick={this.handleMenu}
					color="inherit"
				>
					<AccountCircle />
					<Typography variant="title" color="inherit" >
						&nbsp;{selectedRoot.title}
					</Typography>
				</Button>

				<Menu
					id="menu-appbar"
					anchorEl={anchorEl}
					transformOrigin={{
						horizontal: 'left',
						vertical: 'top',

					}}
					anchorOrigin={{
						horizontal: 'left',
						vertical: 'bottom',
					}}
					open={open}
					onClose={this.handleClose}
				>
					{this.menuItems()}
				</Menu>
			</div >
		)
	}

}

// @ts-ignore
export default withStyles(styles)((withRouter(RootSwitch) as React.Component<any, any>))

