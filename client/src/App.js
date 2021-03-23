import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Signup from './pages/Signup';
import Login from './pages/Login'

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/landing" component={LandingPage}  />
          <Route path="/" component={Signup} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
