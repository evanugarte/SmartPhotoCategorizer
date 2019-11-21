import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import Routing from "./Routing";
import Navbar from "./components/Navbar";
import Amplify, { Auth } from "aws-amplify";
import config from "./aws-exports";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";

Amplify.configure(config);
// Amplify.configure({
//   Auth: {
//     mandatorySignIn: true,
//     region: config.cognito.REGION,
//     userPoolId: config.cognito.USER_POOL_ID,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID,
//     userPoolWebClientId: config.cognito.APP_CLIENT_ID
//   }
// });

function App(props) {
  const [authenticated, setAuthenticated] = useState(false);

  const [isAuthenticating, setIsAuthenticating] = useState(true);

  async function getAuthStatus() {
    try {
      await Auth.currentSession();
      setAuthenticated(true);
    }
    catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  useEffect(() => {
    getAuthStatus();
  });

  async function handleLogout() {
    await Auth.signOut();
    setAuthenticated(false);
    props.history.push("/login");
  }

  return (
    !isAuthenticating &&
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
