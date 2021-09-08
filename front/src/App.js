import './App.css';

import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Donations from "./views/Donations";

function App() {
  return (
      <Router>
          <div>
              <Switch>
                  <Route path='/' component={Donations} />
              </Switch>
          </div>
      </Router>
  );
}

export default App;
