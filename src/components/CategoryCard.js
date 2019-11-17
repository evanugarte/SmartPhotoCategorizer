import React from "react";
import {
  Card, CardBody,
  CardTitle, Button
} from "reactstrap";
import CardMedia from "@material-ui/core/CardMedia";

function CategoryCard(props) {
  return (
    <div>
      <Card style={{ width: "70%" }}>
        <CardMedia
          className={props.name}
          image={props.photoData}
          title="Paella dish"
        />
        <CardBody>
          <CardTitle>{props.name}</CardTitle>
          {/* <CardSubtitle>{props.count} photos</CardSubtitle> */}
          <Button onClick={() =>
            this.props.history.push(`/category/${props.name}`)}>
            Visit
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default CategoryCard;
