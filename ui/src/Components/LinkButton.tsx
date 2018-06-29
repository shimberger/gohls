import * as React from 'react';
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';

function LinkButton(props) {
	return (
		<Button
			// @ts-ignore
			component={Link}
			{...props} >
			{props.children}
		</Button>
	)
}

export default LinkButton
