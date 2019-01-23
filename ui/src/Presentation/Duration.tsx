import * as React from 'react';

function pad(str: string): string {
	const pad2 = "00"
	return pad2.substring(0, pad2.length - str.length) + str
}

class Duration extends React.Component<any, any> {
	public render() {
		const time = parseInt(this.props.duration, 0)
		const hours = Math.floor(time / 3600)
		const minutes = (Math.floor((time - hours * 3600) / 60))
		const seconds = (time - hours * 3600 - minutes * 60)
		return (
			<span>
				{pad(hours + "")}:{pad(minutes + "")}:{pad(seconds + "")}
			</span>
		);
	}
}

export default Duration;
