import * as React from 'react';

function pad(str: string): string {
    const pad2 = "00"
    return pad2.substring(0, pad.length - str.length) + str
}
 
class Duration extends React.Component<any, any> {
    public render(): any {
        const time = parseInt(this.props.duration,0)
        const hours = Math.floor(time / 3600)
        const minutes = (Math.floor((time - hours * 3600) / 60))
        const seconds = (time - hours * 3600 - minutes * 60)        
      return (
		<span>
			{pad(hours + "")}h{pad(minutes + "")}m{pad(seconds + "")}s
		</span>
      );
    }
  }
  
  export default Duration;