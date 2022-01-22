import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function ClipDialog(props) {
	const handleDownload = props.onDownload || (() => { })
	const handleClose = props.onClose || (() => { })
	const [start, setStart] = useState("0")
	const [duration, setDuration] = useState("60")
	return (
		<Dialog
			open={props.open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"Download video clip"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Enter the starting position and duration of the clip in seconds.
					<br /><br />
				</DialogContentText>
				<TextField
					label="Start at"
					value={start}
					autoFocus={true}
					onChange={(e) => setStart((e.target.value))}
				/>
				&nbsp;&nbsp;
				<TextField
					label="Duration"
					value={duration}
					onChange={(e) => setDuration((e.target.value))}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button
					onClick={() => handleDownload(start, duration)}
					color="primary"
				>
					Download
				</Button>
			</DialogActions>
		</Dialog>
	)
}
