import React from "react";
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";

function Photo(props) {
  return (
    <Card>
      <CardImg top style={{
        width: "250px",
        height: "250px",
        position: "relative"
      }}
      src={props.image} alt="Card image cap" />
      <CardBody>
        <CardTitle>{props.title}</CardTitle>
        <CardSubtitle>{props.uploadDate}</CardSubtitle>
        {/* <Button>Button</Button> */}
      </CardBody>
    </Card>
  );
}

export default Photo;
