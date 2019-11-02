import React from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import image from "./black.png";

function PhotoList() {

  const images = [
    { name: "IMG_2013", uploadDate: "12/20/19", image: image },
    { name: "IMG_4021", uploadDate: "12/20/19", image: image },
    { name: "IMG_1227", uploadDate: "12/20/19", image: image }
  ];

  const { name } = useParams();
  return (
    <div>
      <h1>Photos for {name}</h1>
      {images.map((image, index) => {
        return (
          <React.Fragment key={index}>
            <Row>
              <Col>
                <img src={image.image} alt="entry" />
              </Col>
              <Col>
                <p>
                  {image.name} uploaded: {image.uploadDate}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button>
                  Download
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default PhotoList;
