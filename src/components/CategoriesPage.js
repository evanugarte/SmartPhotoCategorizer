import React from "react";
import {
  Card, CardImg, CardBody,
  CardTitle, CardSubtitle,
  Container, Button
} from "reactstrap";
import SearchBar from "./SearchBar";
import img from "./black.png";
import "../App.css";

function Employees(props) {

  const categories = [
    { name: "nature", count: 10 },
    { name: "restaurant", count: 7 },
    { name: "cars", count: 19 }
  ];

  function renderPersonEntries() {
    return (
      categories.map((category, index) => {
        return (
          <Card key={index} style={{ width: "70%" }}>
            <CardImg top style={{ width: "50%" }}
              src={img} alt="Card image cap" />
            <CardBody>
              <CardTitle>{category.name}</CardTitle>
              <CardSubtitle>{category.count} photos</CardSubtitle>
              <Button onClick={() =>
                props.history.push(`/category/${category.name}`)}>
                Visit</Button>
            </CardBody>
          </Card>
        );
      })
    );
    // }
  }

  return (
    <Container style={{ textAlign: "left" }} className="Employees">
      <SearchBar {...props} />
      {renderPersonEntries()}
    </Container>
  );
}

export default Employees;
