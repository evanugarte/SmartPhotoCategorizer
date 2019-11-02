import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CategoriesPage from "./components/CategoriesPage";
import PhotoList from "./components/PhotoList";
import { PrivateRoute } from "./PrivateRoute";
import SocialPage from "./components/SocialPage";

function Routing({ appProps }) {
  const signedOutRoutes = [
    { path: "/login", C: LoginPage },
  ];

  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={CategoriesPage} />
        <PrivateRoute exact path="/SocialPage"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={SocialPage} />
        <PrivateRoute exact path="/category/:name"
          appProps={{ allowed: appProps.authenticated, ...appProps }}
          component={PhotoList} />
        {signedOutRoutes.map((x, index) => {
          return (
            <Route key={index} exact path={x.path}
              render={(props) => !appProps.authenticated ? <x.C
                {...appProps} {...props} /> :
                <Route render={() => <Redirect
                  to={{
                    pathname: "/",
                    state: { from: props.location }
                  }} />}
                />}
            />
          );
        })}
        <Route render={(props) => <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }} />}
        />} />
      </Switch>
    </div>
  );
}

export default Routing;
