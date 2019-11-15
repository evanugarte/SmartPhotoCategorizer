import React, { useState, useReducer } from "react";
import { Auth } from "aws-amplify";

//inital form state
const initialFormState = {
  username:" ", email: " ", password: " ", confirmationCode: " "
};

//reducer for sign up form 
function reducer(state, action) {
  switch(action.type) {
  case "updateFormState":
    return {
      ...state, [action.e.target.name]: action.e.target.value
    };
  default:
    return state;
  }
}

async function signUp({ username,email,password }, updateFormType) {
  try {
    await Auth.signUp({
      username,email, password, attributes: { email }
    });

    updateFormType("confirmSignUp");
  } catch (err) {
    alert("error signing up", err);
  }
}

async function confirmSignUp({ username, confirmationCode }, updateFormType) {
  try {
    await Auth.confirmSignUp(username, confirmationCode);
    alert("sign up success!");
    updateFormType("signIn");
  } catch (err) {
    alert("error signing up..", err);
  }
}

async function signIn({ username, password }) {
  try {
    await Auth.signIn(username, password);
    alert("sign in success!");
  } catch (err) {
    alert("error signing up", err);
  }
}

export default function Form() {
  const [formType, updateFormType] = useState("signUp");
  const [formState, updateFormState] = useReducer(reducer, initialFormState);
  function renderForm() {
    switch(formType) {
    case "signUp":
      return (
        <SignUp
          signUp={() => signUp(formState, updateFormType)}
          updateFormState={e => updateFormState({ type: "updateFormState", e })}
        />
      );
    case "confirmSignUp":
      return (
        <ConfirmSignUp
          confirmSignUp={() => confirmSignUp(formState, updateFormType)}
          updateFormState={e => updateFormState({ type: "updateFormState", e })}
        />
      );
    case "signIn":
      return (
        <SignIn
          signIn={() => signIn(formState)}
          updateFormState={e => updateFormState({ type: "updateFormState", e })}
        />
      );
    default:
      return null;
    }
  }
  

  return (
    <div>
      <div>
        {renderForm(formState)}
      </div>
      {
        formType === "signUp" && (
          <p style={styles.footer}>
            Already have an account? <span
              style={styles.anchor}
              onClick={() => updateFormType("signIn")}
            >Sign In</span>
          </p>
        )
      }
      {
        formType === "signIn" && (
          <p style={styles.footer}>
            Need an account? <span
              style={styles.anchor}
              onClick={() => updateFormType("signUp")}
            >Sign Up</span>
          </p>
        )
      }
    </div>
  );
}

function SignUp(props) {
  return (
    <div style={styles.container}>
      <input 
        name='username'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
        placeholder='username'
      />
      <input
        type='password'
        name='password'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
        placeholder='password'
      />
      <input
        name='email'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
        placeholder='email'
      />
   
      <button onClick={props.signUp} style={styles.button}>
        Sign Up
      </button>
    </div>
  );
}

function SignIn(props) {
  return (
    <div style={styles.container}>
      <input 
        name='username'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
        placeholder='username'
      />
      <input
        type='password'
        name='password'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
        placeholder='password'
      />
      <button style={styles.button} onClick={props.signIn}>
        Sign In
      </button>
    </div>
  );
}

function ConfirmSignUp(props) {
  return (
    <div style={styles.container}>
      <input
        name='confirmationCode'
        placeholder='Confirmation Code'
        // eslint-disable-next-line semi
        onChange={e => {e.persist();props.updateFormState(e)}}
        style={styles.input}
      />
      <button onClick={props.confirmSignUp} style={styles.button}>
        Confirm Sign Up
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    height: 45,
    marginTop: 8,
    width: 300,
    maxWidth: 300,
    padding: "0px 8px",
    fontSize: 16,
    outline: "none",
    border: "none",
    borderBottom: "2px solid rgba(0, 0, 0, .3)"
  },
  button: {
    backgroundColor: "#006bfc",
    color: "white",
    width: 316,
    height: 45,
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    cursor: "pointer",
    border:"none",
    outline: "none",
    borderRadius: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .3)",
  },
  
  anchor: {
    color: "#006bfc",
    cursor: "pointer"
  }
};