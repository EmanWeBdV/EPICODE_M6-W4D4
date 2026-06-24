require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authorsRouter = require("./src/api/authors/authors");
const blogPostsRouter = require("./src/api/blogPosts/blogPosts");

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Strive Blog API");
});

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

server.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({
    message: err.message || "Errore del server",
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connessione a MongoDB completata");

    server.listen(port, () => {
      console.log(`Server avviato sulla porta ${port}`);
    });
  } catch (error) {
    console.error("Errore connessione database:", error);
  }
};

startServer();
