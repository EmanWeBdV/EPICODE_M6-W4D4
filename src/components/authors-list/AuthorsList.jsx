import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { API_URL } from "../../apiConfig";

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/authors?page=${page}&limit=6`);

        if (!response.ok) {
          throw new Error("Errore nel recupero degli autori");
        }

        const authorsData = await response.json();
        setAuthors(authorsData.authors || authorsData);
        setTotalPages(authorsData.totalPages || 1);
        setTotalAuthors(authorsData.totalAuthors || authorsData.length || 0);
      } catch (error) {
        setError("Backend non disponibile o nessun autore presente nel database.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [page]);

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

      {!error && totalAuthors > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-5">
          <Button
            variant="outline-dark"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Precedente
          </Button>
          <span>
            Pagina {page} di {totalPages} - {totalAuthors} autori
          </span>
          <Button
            variant="outline-dark"
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Successiva
          </Button>
        </div>
      )}
    </>
  );
};

export default AuthorsList;
