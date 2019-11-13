import React from "react";
import { Auth } from "aws-amplify";
import { FaFacebook, FaGoogle, FaEnvelope } from "react-icons/fa";


function Buttons(props) {
  return (
    <div>
      <div style={styles.container}>
        <button
          style={{ ...styles.button, ...styles.facebook }}
          onClick={() => Auth.federatedSignIn({provider: "Facebook"})}
        >
          <FaFacebook color="white" />
          <p style={styles.text}>Sign in with Facebook</p>
        </button>

        <button
          style={{ ...styles.button, ...styles.google }}
          onClick={() => Auth.federatedSignIn({provider: "Google"})}
        >
          <FaGoogle color="red" />
          <p style={{...styles.text}}>Sign in with Google</p>
        </button>

   
        <button
          style={{ ...styles.button, ...styles.email }}
          onClick={() => props.updateFormState("email")}
        >
          <FaEnvelope color="white" />
          <p style={{...styles.text}}>Sign in/Sign up with Email</p>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "30vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  button: {
    width: "100%",
    maxWidth: 250,
    marginBottom: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0px 16px",
    borderRadius: 2,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .3)",
    cursor: "pointer",
    outline: "none",
    border: "none",
    minHeight: 40,
  },
  facebook: {
    backgroundColor: "#3b5998"
  },
  email: {
    backgroundColor: "#db4437"
  },
  google:{
    backgroundColor: "orange"
  },
  checkAuth: {
    backgroundColor: "#02bd7e"
  },

  signOut: {
    backgroundColor: "black"
  },
  withAuthenticator: {
    backgroundColor: "#FF9900"
  },
  icon: {
    height: 16,
    marginLeft: -1
  },
  text: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
  },
  blackText: {
    color: "black"
  },
  
  orangeText: {
    color: "#FF9900"
  }
};

export default Buttons;