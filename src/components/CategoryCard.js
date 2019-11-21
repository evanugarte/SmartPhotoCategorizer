import React from "react";
import {
  Card, CardBody,
  CardTitle, Button
} from "reactstrap";

function CategoryCard(props) {
  return (
    <div>
      <Card style={{ width: "70%" }}>
        <CardBody>
          <CardTitle>{props.name}</CardTitle>
          {/* <CardSubtitle>{props.count} photos</CardSubtitle> */}
          <Button onClick={() =>
            props.history.push(`/category/${props.name}`)}>
            Visit
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default CategoryCard;
