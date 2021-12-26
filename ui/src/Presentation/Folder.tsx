import FolderIcon from '@mui/icons-material/FolderOpen';
import * as React from 'react';
import ListItem from './ListItem';
import ListItemDetails from './ListItemDetails';

export default function Folder(props) {
	return (
		<ListItem to={"/list/" + props.path} icon={FolderIcon}>
			<ListItemDetails title={props.name} to={"/list/" + props.path} />
		</ListItem>
	);
}
