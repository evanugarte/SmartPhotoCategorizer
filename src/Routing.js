import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import LoginPage from "./components/Login";
import SignUpPage from "./components/SignUp";
import CategoriesPage from "./components/CategoriesPage";
import PhotoList from "./components/PhotoList";
import SocialPage from "./components/SocialPage";
import UploadPage from "./components/UploadPage";
import ProfilePage from "./components/ProfilePage";

function Routing({ appProps }) {
  const signedInRoutes = [
    { path: "/", component: SocialPage },
    { path: "/Categories", component: CategoriesPage },
    { path: "/UploadView", component: UploadPage },
    { path: "/ProfileView", component: ProfilePage },
    { path: "/category/:name", component: PhotoList }
  ];
  const signedOutRoutes = [
    { path: "/login", component: LoginPage },
    { path: "/signup", component: SignUpPage }
  ];

  return (
    <div>
      <Switch>
        {signedInRoutes.map((route, index) => {
          return (
            <PrivateRoute key={index} exact path={route.path}
              appProps={{ allowed: appProps.authenticated, ...appProps }}
              component={route.component} />
          );
        })}
        {signedOutRoutes.map((route, index) => {
          return (
            <Route key={index} exact path={route.path}
              render={(props) => !appProps.authenticated ? <route.component
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
