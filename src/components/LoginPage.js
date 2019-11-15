import React, { useState } from "react";
import { Container, FormGroup, Label, Input, Button } from "reactstrap";

function LoginPage () {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const forms = [
    { text: "Email", name: "email", setCredential: setEmail },
    { text: "Password", name: "password", setCredential: setPassword }
  ];

  function formEmpty () {
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
                onChange={(e) => x.setCredential(e.target.value)}
              />
            </FormGroup>
          );
        })}
        <Button
          block
          disabled={!formEmpty()}
          type="submit"
        >
          Login
        </Button>
      </form>
    </Container>
  );
}

export default LoginPage;
