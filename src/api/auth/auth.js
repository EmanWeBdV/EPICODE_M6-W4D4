const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthorModel = require("../../models/author");

const authRouter = express.Router();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const createToken = (author) =>
  jwt.sign(
    {
      id: author._id,
      email: author.email,
      name: `${author.nome} ${author.cognome}`,
    },
    jwtSecret,
    { expiresIn: "7d" }
  );

if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.id}@google.local`;
          const avatar = profile.photos?.[0]?.value || "https://picsum.photos/400/400";

          const author = await AuthorModel.findOneAndUpdate(
            { email },
            {
              nome: profile.name?.givenName || profile.displayName || "Google",
              cognome: profile.name?.familyName || "User",
              email,
              dataDiNascita: "Non indicata",
              avatar,
              googleId: profile.id,
            },
            {
              new: true,
              upsert: true,
              runValidators: true,
            }
          );

          done(null, author);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Token mancante" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    res.status(401).send({ message: "Token non valido" });
  }
};

authRouter.get("/google", (req, res, next) => {
  if (!googleConfigured) {
    return res.status(503).send({
      message: "Login Google non configurato. Aggiungi GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET.",
    });
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    if (!googleConfigured) {
      return res.redirect(`${clientUrl}/?login=ko`);
    }

    passport.authenticate("google", {
      session: false,
      failureRedirect: `${clientUrl}/?login=ko`,
    })(req, res, next);
  },
  (req, res) => {
    const token = createToken(req.user);
    res.redirect(`${clientUrl}/?token=${token}`);
  }
);

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.user.id);

    if (!author) {
      return res.status(404).send({ message: "Utente non trovato" });
    }

    res.send(author);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  authRouter,
  requireAuth,
  createToken,
};
