const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const AuthorModel = require("../../models/author");
const BlogPostModel = require("../../models/blogPost");
const uploadImage = require("../../utils/cloudinary");
const sendEmail = require("../../utils/email");

const authorsRouter = express.Router();
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
        avatar: blogPost.author.avatar,
      }
    : null,
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [authors, totalAuthors] = await Promise.all([
      AuthorModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuthorModel.countDocuments(),
    ]);

    res.send({
      authors,
      page,
      totalPages: Math.ceil(totalAuthors / limit),
      totalAuthors,
    });
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

    const { page, limit, skip } = getPagination(req);

    const [blogPosts, totalPosts] = await Promise.all([
      BlogPostModel.find({ author: authorId })
        .populate("author")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogPostModel.countDocuments({ author: authorId }),
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

authorsRouter.patch("/:authorId/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).send({ message: "Id autore non valido" });
    }

    const author = await AuthorModel.findById(authorId);

    if (!author) {
      return res.status(404).send({ message: "Autore non trovato" });
    }

    const result = await uploadImage(req.file, "strive-blog/authors");
    author.avatar = result.secure_url;
    await author.save();

    res.send(author);
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

    await sendEmail({
      to: savedAuthor.email,
      subject: "Benvenuto su Strive Blog",
      text: `Ciao ${savedAuthor.nome}, il tuo autore e' stato creato correttamente.`,
    });

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

    await BlogPostModel.deleteMany({ author: authorId });

    res.send({ message: "Autore eliminato correttamente" });
  } catch (error) {
    next(error);
  }
});

module.exports = authorsRouter;
