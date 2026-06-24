# Strive Blog - Capitolo finale

Progetto full stack per il compito EPICODE: frontend React + Vite, backend Node.js/Express e database MongoDB.

## Link deploy

- Frontend Vercel: `da inserire dopo il deploy`
- Backend Heroku: `da inserire dopo il deploy`

## Tecnologie usate

- React 18
- Vite
- React Bootstrap
- Node.js
- Express
- MongoDB + Mongoose
- CORS
- Cloudinary per upload immagini
- Passport Google OAuth
- JWT
- SendGrid opzionale per email

## Funzionalita completate

- CRUD autori: `GET`, `POST`, `PUT`, `DELETE`
- CRUD blog post: `GET`, `POST`, `PUT`, `DELETE`
- Paginazione per autori e blog post
- Ricerca blog post per titolo
- Lista dei post di uno specifico autore
- Form frontend per creare un articolo
- Fetch dei post dal database nella homepage
- Modifica ed eliminazione articolo dal frontend
- Upload avatar autore su Cloudinary
- Upload cover blog post su Cloudinary
- Login Google OAuth con creazione token JWT
- Invio email opzionale con SendGrid quando si crea un autore o un post

## Installazione locale

```bash
npm install
```

Crea un file `.env` partendo da `.env.example` e inserisci almeno:

```env
PORT=3001
MONGODB_URI=la_tua_uri_mongodb
CLIENT_URL=http://localhost:5173
JWT_SECRET=una_stringa_segreta
VITE_API_URL=http://localhost:3001
```

Avvia backend e frontend in due terminali separati:

```bash
npm run server
npm run dev
```

Frontend locale: `http://localhost:5173`  
Backend locale: `http://localhost:3001`

Per caricare dati di prova:

```bash
npm run seed:authors
npm run seed:posts
```

## Rotte backend

### Autori

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| GET | `/authors?page=1&limit=6` | Lista autori paginata |
| GET | `/authors/:authorId` | Singolo autore |
| POST | `/authors` | Crea autore |
| PUT | `/authors/:authorId` | Modifica autore |
| DELETE | `/authors/:authorId` | Elimina autore |
| GET | `/authors/:authorId/blogPosts` | Post di uno specifico autore |
| PATCH | `/authors/:authorId/avatar` | Upload avatar, campo form-data `avatar` |

### Blog post

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| GET | `/blogPosts?page=1&limit=6` | Lista post paginata |
| GET | `/blogPosts?title=react` | Cerca post per titolo |
| GET | `/blogPosts/:blogPostId` | Singolo post |
| POST | `/blogPosts` | Crea post |
| PUT | `/blogPosts/:blogPostId` | Modifica post |
| DELETE | `/blogPosts/:blogPostId` | Elimina post |
| PATCH | `/blogPosts/:blogPostId/cover` | Upload cover, campo form-data `cover` |

### Auth

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| GET | `/auth/google` | Login con Google |
| GET | `/auth/google/callback` | Callback OAuth |
| GET | `/auth/me` | Ritorna utente loggato usando JWT |

Il frontend salva il token JWT in `localStorage` dopo il login Google.

## Variabili ambiente

```env
PORT=3001
MONGODB_URI=
CLIENT_URL=
JWT_SECRET=

VITE_API_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

SENDGRID_API_KEY=
EMAIL_SENDER=
```

Cloudinary, Google OAuth e SendGrid richiedono account esterni: le chiavi non vanno mai caricate su GitHub.

## Deploy

### Backend su Heroku

Lo script `start` e' gia configurato:

```json
"start": "node server.js"
```

Su Heroku devi inserire le variabili ambiente del backend:

- `MONGODB_URI`
- `CLIENT_URL` con URL Vercel
- `JWT_SECRET`
- variabili Cloudinary
- variabili Google OAuth
- variabili SendGrid se vuoi provare le email

### Frontend su Vercel

Impostazioni consigliate:

- Build command: `npm run build`
- Output directory: `dist`
- Variabile ambiente: `VITE_API_URL=https://url-del-backend-heroku`

Dopo il deploy backend, aggiorna anche `CLIENT_URL` su Heroku con l'URL definitivo di Vercel.

## Query MongoDB richieste

Collection usata nelle slide: inserire qui il nome della collection importata.

| Richiesta | Query | Risorse trovate |
| --- | --- | --- |
| Risorse con `isActive` uguale a `true` | `{ isActive: true }` | `da compilare` |
| Risorse con `age` maggiore di 26 | `{ age: { $gt: 26 } }` | `da compilare` |
| Risorse con `age` maggiore di 26 e minore o uguale a 30 | `{ age: { $gt: 26, $lte: 30 } }` | `da compilare` |
| Risorse con `eyes` brown o blue | `{ eyes: { $in: ["brown", "blue"] } }` | `da compilare` |
| Risorse con `eyes` diverso da green | `{ eyes: { $ne: "green" } }` | `da compilare` |
| Risorse con `eyes` diverso da green e blue | `{ eyes: { $nin: ["green", "blue"] } }` | `da compilare` |
| Risorse con `company` uguale a FITCORE, mostrando solo email | filtro `{ company: "FITCORE" }`, projection `{ email: 1, _id: 0 }` | `da compilare` |

In MongoDB Compass puoi usare il filtro nella barra `Filter` e la projection nella barra `Project`.

## Comandi utili

```bash
npm run dev       # frontend Vite
npm run server    # backend Express
npm run build     # build frontend
npm run preview   # anteprima build
npm test          # test con Vitest
```

## Note aggiornamento progetto

Il template iniziale era basato su Create React App. Il progetto e' stato migrato a Vite per usare uno stack piu moderno e vicino a quello studiato.

Audit npm attuale: restano vulnerabilita legate a `react-draft-wysiwyg` / `draft-js`, librerie vecchie del template usate per l'editor. Non ho fatto un aggiornamento forzato per non rompere il form di creazione articoli.

