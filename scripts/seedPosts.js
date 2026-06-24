require("dotenv").config();

const mongoose = require("mongoose");
const AuthorModel = require("../src/models/author");
const BlogPostModel = require("../src/models/blogPost");

const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const authors = await AuthorModel.find();

    if (authors.length === 0) {
      console.log("Nessun autore trovato. Esegui prima npm run seed:authors");
      return;
    }

    const posts = [
      {
        category: "Backend",
        title: "Prime API con Express e MongoDB",
        cover: "https://picsum.photos/1000/300?random=11",
        readTime: { value: 3, unit: "minute" },
        author: authors[0]._id,
        content: "<p>In questo articolo vediamo come creare una semplice API REST con Node.js, Express e MongoDB.</p>",
      },
      {
        category: "JavaScript",
        title: "Come usare fetch per leggere i dati dal backend",
        cover: "https://picsum.photos/1000/300?random=12",
        readTime: { value: 4, unit: "minute" },
        author: authors[1] ? authors[1]._id : authors[0]._id,
        content: "<p>La fetch ci permette di recuperare i dati dal backend e mostrarli nel frontend in modo semplice.</p>",
      },
      {
        category: "React",
        title: "Collegare un form React a una POST API",
        cover: "https://picsum.photos/1000/300?random=13",
        readTime: { value: 5, unit: "minute" },
        author: authors[2] ? authors[2]._id : authors[0]._id,
        content: "<p>In questo esempio inviamo i dati del form al backend usando una richiesta POST.</p>",
      },
    ];

    await BlogPostModel.deleteMany();
    await BlogPostModel.insertMany(posts);

    console.log("Blog posts inseriti correttamente");
  } catch (error) {
    console.error("Errore durante il seed dei blog posts:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedPosts();
