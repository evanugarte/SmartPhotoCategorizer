import React, { useState } from "react";
import {
  Container,
  Button,
  FormGroup,
  Input,
  Label,
  Spinner
} from "reactstrap";
import { Auth } from "aws-amplify";
// import { checkIfUserExists, addUserToRDS } from "../backend/RDSFunctions";
// import { getAuthInfo } from "../backend/AuthFunctions";
// import md5 from "md5";
// import config from "../backend/config";

function LoginView(props) {
  const [email, setEmail] = useState("");
  // const [modalShown, setModalShown] = useState(false);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const forms = [
    { text: "Email", name: "email", callback: setEmail },
    { text: "Password", name: "password", callback: setPassword }
  ];

  async function handleSignIn() {
    setLoading(true);
    try {
      await Auth.signIn(email, password);
      props.setAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  }

  function formEmpty() {
    return email.length && password.length;
  }

  return (
    <Container>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        {forms.map((x, index) => {
          return (
            <FormGroup key={index}>
              <Label>{x.text}</Label>
              <Input
                autoFocus
                name={x.name}
                type={x.name}
                onChange={(e) => x.callback(e.target.value)}
              />
            </FormGroup>
          );
        })}
        <Button
          block
          disabled={!formEmpty() || loading}
          type="submit"
          onClick={() => handleSignIn(email, password)}
        >
          {loading ? <Spinner color="primary" /> : "Login"}
        </Button>
      </form>
      <br />
      <a href="signup">New user? Sign up here!</a>
    </Container>
  );
}

export default LoginView;
