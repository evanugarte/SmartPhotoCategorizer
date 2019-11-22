import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import { loginWithFacebookGoogle } from "../actions/loginWithFacebookGoogle";

class FacebookGoogleLogin extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  componentClicked = () => {};

  responseFacebook = response => {
    const loginData = {
      userid: response.userID,
      email: response.email
    };
    this.props.loginWithFacebookGoogle(loginData, 
      this.props.history, this.props.setAuthenticated);
  };

  responseGoogle = response => {
    const loginData = {
      email: response.w3.U3,
      userid: response.w3.Eea
    };
    this.props.loginWithFacebookGoogle(
      loginData, this.props.history, this.props.setAuthenticated);
  };

  onFailure = error => {
    console.error("google login error ", error);
  };

  render() {
    let fbContent;
    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <FacebookLogin
            style={{ borderRadius: 2 }}
            appId="1330563343769066"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
          />
          <br />
          <GoogleLogin
            style={{ width: 242 }}
            clientId={"457180824943-lv16voqfvsiurmjcesmbp6qq" +
             "9t9iv03o.apps.googleusercontent.com"}
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.onFailure}
          />
          <br />
        </div>
      );
    }
    return <div>{fbContent}</div>;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { loginWithFacebookGoogle }
)(FacebookGoogleLogin);