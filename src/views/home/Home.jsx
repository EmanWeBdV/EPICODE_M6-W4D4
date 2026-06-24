import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import AuthorsList from "../../components/authors-list/AuthorsList";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchValue(inputValue);
  };

  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={9}>
            <Form.Group controlId="search-posts">
              <Form.Label>Cerca articolo per titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Scrivi una parola del titolo"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button type="submit" variant="dark" className="w-100">
              Cerca
            </Button>
          </Col>
        </Row>
      </Form>

      <BlogList searchValue={searchValue} />
      <AuthorsList />
    </Container>
  );
};

export default Home;
