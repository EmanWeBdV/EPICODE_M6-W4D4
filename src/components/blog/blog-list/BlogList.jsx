import React, { useEffect, useState } from "react";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = ({ searchValue }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
        const query = searchValue ? `?title=${encodeURIComponent(searchValue)}` : "";
        const response = await fetch(`${apiUrl}/blogPosts${query}`);

        if (!response.ok) {
          throw new Error("Errore nel recupero dei post");
        }

        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        setError("Backend non disponibile o nessun post presente nel database.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchValue]);

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
    </>
  );
};

export default BlogList;
