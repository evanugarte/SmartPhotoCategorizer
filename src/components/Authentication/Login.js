import React, { useReducer, useEffect, useState } from "react";
import Buttons from "./Buttons";
import Form from "./Form";

import { Hub, Auth } from "aws-amplify";
import { FaSignOutAlt } from "react-icons/fa";

const initialUserState = { user: null, loading: true };

function Login() {
  const [userState, dispatch] = useReducer(reducer, initialUserState);
  const [formState, updateFormState] = useState("base");

  useEffect(() => {
    // set listener for auth events
    Hub.listen("auth", (data) => {
      const { payload } = data;
      if (payload.event === "signIn") {
        setImmediate(() => dispatch({ type: "setUser", user: payload.data }));
        setImmediate(() => window.history.pushState({}, null, "http://localhost:3000"));
        updateFormState("base");
      }
      // listener for form sign up
      if (payload.event === "signOut") {
        setTimeout(() => dispatch({ type: "setUser", user: null }), 350);
      }
    });
    //check for the current user 
    if (!window.location.search.includes("?signedin=true")) {
      checkUser(dispatch); 
    }
  }, []);

  // This renders the custom form
  if (formState === "email") {
    return (
      <div style={styles.appContainer}>
     
        <Form />
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
   
      {
        userState.loading && (
          <div style={styles.body}>
            <p>Loading...</p>
          </div>
        )
      }
      {
        !userState.user && !userState.loading && (
          <Buttons
            updateFormState={updateFormState}
          />
        )
      }
      {
        userState.user && userState.user.signInUserSession && (
          <div style={styles.body}>
            <h4>
              You are signed in as {userState.user.signInUserSession.idToken.payload.email}
            </h4>
            <button
              style={{ ...styles.button, ...styles.signOut }}
              onClick={signOut}>
              <FaSignOutAlt color='white' />
              <p style={{...styles.text}}>Sign out/Switch account</p> 
            </button>
          </div>
        )
      }
   
    </div>
  );
}

function reducer (state, action) {
  switch(action.type) {
  case "setUser":  
    return { ...state, user: action.user, loading: false };
  case "loaded":
    return { ...state, loading: false };
  default:
    return state;
  }
}

async function checkUser(dispatch) {
  try {
    const user = await Auth.currentAuthenticatedUser();
    // console.log('user: ', user)
    dispatch({ type: "setUser", user });
  } catch (err) {
    //console.log('err: ', err)
    dispatch({ type: "loaded" });
  }
}

function signOut() {
  Auth.signOut({global:true});
    
}



const styles = {
  appContainer: {
    paddingTop: 85,
  },
  loading: {
    
  },
  button: {
    marginTop: 15,
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
    minHeight: 40
  },
  text: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold"
  },
  signOut: {
    backgroundColor: "black"
  },
  footer: {
    fontWeight: "600",
    padding: "0px 25px",
    textAlign: "right",
    color: "rgba(0, 0, 0, 0.6)"
  },
  anchor: {
    color: "rgb(255, 153, 0)",
    textDecoration: "none"
  },
  body: {
    padding: "0px 30px",
    height: "78vh"
  }
};



export default Login;