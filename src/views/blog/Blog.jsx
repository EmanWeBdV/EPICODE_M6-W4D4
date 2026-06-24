import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, getAuthHeaders } from "../../apiConfig";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    cover: "",
    readTimeValue: 1,
    content: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`${API_URL}/blogPosts/${params.id}`);

        if (!response.ok) {
          navigate("/");
          return;
        }

        const blogData = await response.json();
        setBlog(blogData);
        setFormData({
          title: blogData.title || "",
          category: blogData.category || "",
          cover: blogData.cover || "",
          readTimeValue: blogData.readTime?.value || 1,
          content: blogData.content || "",
        });
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [navigate, params.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/blogPosts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          cover: formData.cover,
          readTime: {
            value: Number(formData.readTimeValue),
            unit: "minute",
          },
          content: formData.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore modifica post");
      }

      const updatedBlog = await response.json();
      setBlog(updatedBlog);
      setEditMode(false);
      setSuccessMessage("Articolo modificato correttamente.");
    } catch (error) {
      setErrorMessage("Non sono riuscito a modificare l'articolo.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Vuoi eliminare questo articolo?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/blogPosts/${params.id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Errore eliminazione post");
      }

      navigate("/");
    } catch (error) {
      setErrorMessage("Non sono riuscito a eliminare l'articolo.");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="blog-details-root">
      <Container>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Image className="blog-details-cover" src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...blog.author} />
          </div>
          <div className="blog-details-info">
            <div>{blog.createdAt}</div>
            <div>{`lettura da ${blog.readTime?.value} ${blog.readTime?.unit}`}</div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
        </div>

        <div className="blog-details-actions">
          <Button variant="outline-dark" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Annulla modifica" : "Modifica articolo"}
          </Button>
          <Button variant="outline-danger" onClick={handleDelete}>
            Elimina articolo
          </Button>
        </div>

        {editMode && (
          <Form className="blog-edit-form" onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cover</Form.Label>
              <Form.Control name="cover" value={formData.cover} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tempo di lettura</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="readTimeValue"
                value={formData.readTimeValue}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenuto HTML</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="dark">
              Salva modifiche
            </Button>
          </Form>
        )}

        <div
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        ></div>
      </Container>
    </div>
  );
};

export default Blog;
