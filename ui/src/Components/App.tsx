import primaryColor from '@material-ui/core/colors/teal';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import 'typeface-roboto';
import List from './List';
import Player from './Player';

const theme = createMuiTheme({
	palette: {
		primary: primaryColor,
		type: 'dark',
	},
	typography: {
		useNextVariants: true
	},
});

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<Route name="list" path="/list/**" component={List} />
					<Route name="play" path="/play/**" component={Player} />
					<Redirect to="/list/" />
				</Switch>
			</Router>
		</MuiThemeProvider>
	);
}

export default App;
