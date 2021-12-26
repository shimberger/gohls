import Button from '@mui/material/Button';
import * as React from 'react';
import { Link } from "react-router-dom";

export default function LinkButton(props) {
	return (
		<Button
			// @ts-ignore
			component={Link}
			{...props} >
			{props.children}
		</Button>
	)
}
