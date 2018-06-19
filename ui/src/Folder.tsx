

import * as React from 'react';
import { Link } from "react-router-dom";

class Folder extends React.Component<any, any> {
	public render(): any {
		return (
			<Link to={"/list/" + this.props.path }  >
				<div className="list-item folder" key={this.props.path}>
					<div className="left">
						<div className="frame">
							<div className="inner">
								<span className="glyphicon glyphicon-folder-open" aria-hidden="true"/>
							</div>
						</div>
					</div>
					<div className="right">
						{this.props.name}
					</div>
				</div>
			</Link>
		)
	}
}
  
export default Folder;