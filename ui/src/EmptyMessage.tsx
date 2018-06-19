
import * as React from 'react';

import './EmptyMessage.css';

class EmptyMessage extends React.Component<any, any> {
    public render(): any {
		return (
			<div className="empty-message">
				<p>No folders or videos found in folder :-(</p>
			</div>
		)
    }
}
  
export default EmptyMessage;
