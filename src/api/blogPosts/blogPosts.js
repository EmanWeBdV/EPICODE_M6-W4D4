const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const BlogPostModel = require("../../models/blogPost");
const uploadImage = require("../../utils/cloudinary");
const sendEmail = require("../../utils/email");

const blogPostsRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const getPagination = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

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
        email: blogPost.author.email,
        avatar: blogPost.author.avatar,
      }
    : null,
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const { title } = req.query;
    const { page, limit, skip } = getPagination(req);
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const [blogPosts, totalPosts] = await Promise.all([
      BlogPostModel.find(filter).populate("author").sort({ createdAt: -1 }).skip(skip).limit(limit),
      BlogPostModel.countDocuments(filter),
    ]);

    res.send({
      posts: blogPosts.map(formatBlogPost),
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
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

    await sendEmail({
      to: populatedBlogPost.author?.email,
      subject: "Nuovo articolo pubblicato",
      text: `Il post "${populatedBlogPost.title}" e' stato pubblicato su Strive Blog.`,
    });

    res.status(201).send(formatBlogPost(populatedBlogPost));
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const { blogPostId } = req.params;

    if (!mongoose.isValidObjectId(blogPostId)) {
      return res.status(400).send({ message: "Id blog post non valido" });
    }

    const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(blogPostId, req.body, {
      new: true,
      runValidators: true,
    }).populate("author");

    if (!updatedBlogPost) {
      return res.status(404).send({ message: "Blog post non trovato" });
    }

    res.send(formatBlogPost(updatedBlogPost));
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const { blogPostId } = req.params;

    if (!mongoose.isValidObjectId(blogPostId)) {
      return res.status(400).send({ message: "Id blog post non valido" });
    }

    const deletedBlogPost = await BlogPostModel.findByIdAndDelete(blogPostId);

    if (!deletedBlogPost) {
      return res.status(404).send({ message: "Blog post non trovato" });
    }

    res.send({ message: "Blog post eliminato correttamente" });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.patch("/:blogPostId/cover", upload.single("cover"), async (req, res, next) => {
  try {
    const { blogPostId } = req.params;

    if (!mongoose.isValidObjectId(blogPostId)) {
      return res.status(400).send({ message: "Id blog post non valido" });
    }

    const blogPost = await BlogPostModel.findById(blogPostId).populate("author");

    if (!blogPost) {
      return res.status(404).send({ message: "Blog post non trovato" });
    }

    const result = await uploadImage(req.file, "strive-blog/posts");
    blogPost.cover = result.secure_url;
    await blogPost.save();

    res.send(formatBlogPost(blogPost));
  } catch (error) {
    next(error);
  }
});

module.exports = blogPostsRouter;
