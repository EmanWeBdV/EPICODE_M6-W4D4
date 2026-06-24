import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Spinner } from "react-bootstrap";

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/authors`);

        if (!response.ok) {
          throw new Error("Errore nel recupero degli autori");
        }

        const authorsData = await response.json();
        setAuthors(authorsData);
      } catch (error) {
        setError("Backend non disponibile o nessun autore presente nel database.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <h2 className="mt-5 mb-4">Autori del blog</h2>

      {error && <Alert variant="warning">{error}</Alert>}

      {!error && (
        <Row>
          {authors.map((author) => (
            <Col md={4} key={author._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={author.avatar}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>
                    {author.nome} {author.cognome}
                  </Card.Title>
                  <Card.Text>{author.email}</Card.Text>
                  <Card.Text>Data di nascita: {author.dataDiNascita}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default AuthorsList;
