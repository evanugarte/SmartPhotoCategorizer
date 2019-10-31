import React, { Component } from "react";
import store from "../store";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import SocialPage from "./SocialPage";

class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route exact path="/" component={SocialPage} />
        </Router>
      </Provider>
    );
  }
}

export default Main;
