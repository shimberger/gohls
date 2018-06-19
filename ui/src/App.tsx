import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route  } from "react-router-dom";

import './App.css';

import List from './List';
import Player from './Player';

class App extends React.Component {
  public render(): any {
    return (
      <div className="App">
      <Router>
          <div>
            <Route exact={true} name="list" path="/list/**"  component={List} />
            <Route exact={true} name="play" path="/play/**"  component={Player} />
            <Redirect exact={true} path ="/" to="/list/" />
          </div>
      </Router>
      </div>
    );
  }
}

export default App;