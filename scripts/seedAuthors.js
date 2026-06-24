require("dotenv").config();

const mongoose = require("mongoose");
const AuthorModel = require("../src/models/author");

const authors = [
  {
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@example.com",
    dataDiNascita: "12/04/1992",
    avatar: "https://picsum.photos/400/400?random=1",
  },
  {
    nome: "Giulia",
    cognome: "Bianchi",
    email: "giulia.bianchi@example.com",
    dataDiNascita: "23/09/1995",
    avatar: "https://picsum.photos/400/400?random=2",
  },
  {
    nome: "Luca",
    cognome: "Verdi",
    email: "luca.verdi@example.com",
    dataDiNascita: "05/01/1990",
    avatar: "https://picsum.photos/400/400?random=3",
  },
];

const seedAuthors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await AuthorModel.deleteMany();
    await AuthorModel.insertMany(authors);
    console.log("Autori inseriti correttamente");
  } catch (error) {
    console.error("Errore durante il seed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedAuthors();
