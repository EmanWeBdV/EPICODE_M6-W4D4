import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const NewBlogPost = () => {
  const [authors, setAuthors] = useState([]);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    category: "Categoria 1",
    title: "",
    cover: "https://picsum.photos/1000/300?random=20",
    readTimeValue: 1,
    author: "",
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/authors`);

        if (!response.ok) {
          throw new Error("Errore nel recupero autori");
        }

        const authorsData = await response.json();
        setAuthors(authorsData);

        if (authorsData.length > 0) {
          setFormData((currentFormData) => ({
            ...currentFormData,
            author: authorsData[0]._id,
          }));
        }
      } catch (error) {
        setErrorMessage("Impossibile caricare gli autori dal backend.");
      }
    };

    fetchAuthors();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setFormData({
      category: "Categoria 1",
      title: "",
      cover: "https://picsum.photos/1000/300?random=20",
      readTimeValue: 1,
      author: authors[0]?._id || "",
    });
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      const response = await fetch(`${apiUrl}/blogPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formData.category,
          title: formData.title,
          cover: formData.cover,
          readTime: {
            value: Number(formData.readTimeValue),
            unit: "minute",
          },
          author: formData.author,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore salvataggio articolo");
      }

      setFormData({
        category: "Categoria 1",
        title: "",
        cover: "https://picsum.photos/1000/300?random=20",
        readTimeValue: 1,
        author: authors[0]?._id || "",
      });
      setEditorState(EditorState.createEmpty());
      setSuccessMessage("Articolo creato correttamente.");
    } catch (error) {
      setErrorMessage("Non sono riuscito a creare l'articolo.");
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select size="lg" name="category" value={formData.category} onChange={handleChange}>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="blog-author" className="mt-3">
          <Form.Label>Autore</Form.Label>
          <Form.Select size="lg" name="author" value={formData.author} onChange={handleChange} required>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.nome} {author.cognome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="blog-cover" className="mt-3">
          <Form.Label>Cover</Form.Label>
          <Form.Control
            size="lg"
            placeholder="https://..."
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-read-time" className="mt-3">
          <Form.Label>Tempo di lettura</Form.Label>
          <Form.Control
            type="number"
            min="1"
            size="lg"
            name="readTimeValue"
            value={formData.readTimeValue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="new-blog-editor-wrapper"
            editorClassName="new-blog-content"
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="button" size="lg" variant="outline-dark" onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
