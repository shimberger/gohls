import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import FolderIcon from '@material-ui/icons/FolderOpen';
import ListItem from './ListItem';
import ListItemDetails from './ListItemDetails';

const styles = {

};

function Folder(props) {
	return (
		<ListItem to={"/list/" + props.path} icon={FolderIcon}>
			<ListItemDetails title={props.name} to={"/list/" + props.path} />
		</ListItem>
	);
}

export default withStyles(styles)(Folder);
