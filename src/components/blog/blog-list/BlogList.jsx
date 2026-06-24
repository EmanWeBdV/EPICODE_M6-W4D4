import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { API_URL } from "../../../apiConfig";
import BlogItem from "../blog-item/BlogItem";

const BlogList = ({ searchValue }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          page,
          limit: 6,
        });

        if (searchValue) {
          query.append("title", searchValue);
        }

        const response = await fetch(`${API_URL}/blogPosts?${query.toString()}`);

        if (!response.ok) {
          throw new Error("Errore nel recupero dei post");
        }

        const postsData = await response.json();
        setPosts(postsData.posts || postsData);
        setTotalPages(postsData.totalPages || 1);
        setTotalPosts(postsData.totalPosts || postsData.length || 0);
      } catch (error) {
        setError("Backend non disponibile o nessun post presente nel database.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchValue, page]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {error && <Alert variant="warning">{error}</Alert>}

      {!error && posts.length === 0 && (
        <Alert variant="info">Nessun articolo trovato con questa ricerca.</Alert>
      )}

      <Row>
        {posts.map((post) => (
          <Col
            key={post._id}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <BlogItem {...post} />
          </Col>
        ))}
      </Row>

      {!error && totalPosts > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-5">
          <Button
            variant="outline-dark"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Precedente
          </Button>
          <span>
            Pagina {page} di {totalPages} - {totalPosts} articoli
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

export default BlogList;
