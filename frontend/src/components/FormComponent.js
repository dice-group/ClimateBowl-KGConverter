import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const FormComponent = ({ onSubmit, queryValue }) => {
  const [query, setQuery] = useState(queryValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query);
  };
  const handleQueryValue = (queryValue) => {
    setQuery(queryValue.target.value);
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                name="query"
                as="textarea"
                defaultValue={query}
                rows={5}
                onChange={handleQueryValue}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Button className="my-2 float-right" type="submit">
              Show
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormComponent;
