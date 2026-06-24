const express = require("express");
const mongoose = require("mongoose");
const AuthorModel = require("../../models/author");
const BlogPostModel = require("../../models/blogPost");

const authorsRouter = express.Router();

const formatBlogPost = (blogPost) => ({
  _id: blogPost._id,
  category: blogPost.category,
  title: blogPost.title,
  cover: blogPost.cover,
  readTime: blogPost.readTime,
  content: blogPost.content,
  createdAt: new Date(blogPost.createdAt).toLocaleDateString("it-IT"),
  author: blogPost.author
    ? {
        _id: blogPost.author._id,
        name: `${blogPost.author.nome} ${blogPost.author.cognome}`,
        avatar: blogPost.author.avatar,
      }
    : null,
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId/blogPosts", async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).send({ message: "Id autore non valido" });
    }

    const author = await AuthorModel.findById(authorId);

    if (!author) {
      return res.status(404).send({ message: "Autore non trovato" });
    }

    const blogPosts = await BlogPostModel.find({ author: authorId })
      .populate("author")
      .sort({ createdAt: -1 });

    res.send(blogPosts.map(formatBlogPost));
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).send({ message: "Id autore non valido" });
    }

    const author = await AuthorModel.findById(authorId);

    if (!author) {
      return res.status(404).send({ message: "Autore non trovato" });
    }

    res.send(author);
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).send(savedAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).send({ message: "Id autore non valido" });
    }

    const updatedAuthor = await AuthorModel.findByIdAndUpdate(authorId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return res.status(404).send({ message: "Autore non trovato" });
    }

    res.send(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).send({ message: "Id autore non valido" });
    }

    const deletedAuthor = await AuthorModel.findByIdAndDelete(authorId);

    if (!deletedAuthor) {
      return res.status(404).send({ message: "Autore non trovato" });
    }

    res.send({ message: "Autore eliminato correttamente" });
  } catch (error) {
    next(error);
  }
});

module.exports = authorsRouter;
