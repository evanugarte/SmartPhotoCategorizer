import React, { useState } from "react";
import {
  Container, Form, Input,
  InputGroup, InputGroupAddon,
  Button
} from "reactstrap";

function SearchBar(props) {

  const [query, setQuery] = useState("");

  function submitQuery(e) {
    e.preventDefault();
    if (query.length) props.history.push(`/category/${query}`);
  }

  return (
    <Container style={{padding: "20px"}}>
      <Form onSubmit={submitQuery}>
        <InputGroup>
          <Input
            style={{ height: 36 }}
            type="input"
            className="form-control"
            name="name"
            placeholder="Search categories here..."
            onChange={(e) => {
              setQuery(e.target.value);
            }} />
          <InputGroupAddon addonType="append">
            <Button onClick={submitQuery}>Search</Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    </Container>
  );

}

export default SearchBar;

