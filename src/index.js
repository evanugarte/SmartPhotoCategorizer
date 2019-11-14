import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter} from "react-router-dom";
import Routing from "./Routing";
import Navbar from "./components/Navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";


import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

function App(props) {

  const [authenticated, setAuthenticated] = useState(false);

  function handleLogout() {
    setAuthenticated(false);
    props.history.push("/login");
  }

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Navbar authed={authenticated} handleLogout={handleLogout} />
          <Routing appProps={{ authenticated, setAuthenticated }} />
        </BrowserRouter>
      </Provider>

    </div>
  );
}

export default withRouter(App);


ReactDOM.render(<App />, document.getElementById("root"));
