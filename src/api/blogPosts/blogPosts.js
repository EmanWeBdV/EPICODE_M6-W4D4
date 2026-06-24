const express = require("express");
const mongoose = require("mongoose");
const BlogPostModel = require("../../models/blogPost");

const blogPostsRouter = express.Router();

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

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const { title } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const blogPosts = await BlogPostModel.find(filter)
      .populate("author")
      .sort({ createdAt: -1 });

    res.send(blogPosts.map(formatBlogPost));
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const { blogPostId } = req.params;

    if (!mongoose.isValidObjectId(blogPostId)) {
      return res.status(400).send({ message: "Id blog post non valido" });
    }

    const blogPost = await BlogPostModel.findById(blogPostId).populate("author");

    if (!blogPost) {
      return res.status(404).send({ message: "Blog post non trovato" });
    }

    res.send(formatBlogPost(blogPost));
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostModel(req.body);
    const savedBlogPost = await newBlogPost.save();
    const populatedBlogPost = await BlogPostModel.findById(savedBlogPost._id).populate("author");

    res.status(201).send(formatBlogPost(populatedBlogPost));
  } catch (error) {
    next(error);
  }
});

module.exports = blogPostsRouter;
