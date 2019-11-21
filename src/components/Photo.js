import React from "react";
import { Row, Col } from "reactstrap";

function Photo(props) {
  return (
    <div>
      <Row>
        <Col>
          <img src={props.image} alt={props.title} />
        </Col>
        <Col>
          <p>
            {props.title} uploaded: {props.uploadDate}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* are we doing downloads? */}
          {/* <Button>
                  Download
                </Button> */}
        </Col>
      </Row>
    </div>
  );
}

export default Photo;
