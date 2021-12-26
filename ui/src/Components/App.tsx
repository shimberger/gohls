import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, } from '@mui/material/styles';
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'typeface-roboto';
import List from './List';
import Player from './Player';
import { teal } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		primary: teal,
		mode: 'dark',
	},	
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/list/" element={<List/>} />
					<Route path="/list/:path" element={<List/>} />
					<Route path="/play/:path" element={<Player/>} />
					<Route path="/" element={<List/>} />
				</Routes>
			</Router>
		</ThemeProvider>
    );
}

export default App;
