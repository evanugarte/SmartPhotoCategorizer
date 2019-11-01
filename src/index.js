import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import Routing from "./Routing";
import Navbar from "./Navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App(props) {

  const [authenticated, setAuthenticated] = useState(true);

  function handleLogout() {
    setAuthenticated(false);
    props.history.push("/login");
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar authed={authenticated}
          handleLogout={handleLogout} />
        <Routing appProps={{ authenticated, setAuthenticated }} />
      </BrowserRouter>
    </div>
  );
}

export default withRouter(App);

ReactDOM.render(<App />, document.getElementById("root"));
