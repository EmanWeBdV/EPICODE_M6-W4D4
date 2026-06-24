import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/blogPosts/${params.id}`);

        if (!response.ok) {
          navigate("/");
          return;
        }

        const blogData = await response.json();
        setBlog(blogData);
      } catch (error) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [navigate, params.id]);

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div className="blog-details-root">
      <Container>
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
