import * as React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ChevronLeft';

export default function BackButton(props) {
	return (
        // @ts-ignore
        <IconButton
            color="inherit"
            component={Link}
            // @ts-ignore
            to={props.to}
            aria-label="Menu"
            size="large">
			<BackIcon />
		</IconButton>
    );
}
