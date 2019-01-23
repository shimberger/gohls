import Button from '@material-ui/core/Button';
import * as React from 'react';
import { Link } from "react-router-dom";

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
