# PAWHOME Cacao Backend

Express and TypeScript API for the PAWHOME pet adoption project. It uses Mongoose to connect to MongoDB and stores pets, adopters, and adoption requests.

## Live deployment

- Backend base URL: https://itelect4-backend-cacao.vercel.app/
- Health check: https://itelect4-backend-cacao.vercel.app/api/health
- Pets: https://itelect4-backend-cacao.vercel.app/api/pets
- Adopters: https://itelect4-backend-cacao.vercel.app/api/adopters
- Adoption requests: https://itelect4-backend-cacao.vercel.app/api/requests

The base URL returns a status message. List endpoints return JSON. For example, `/api/pets` returns an empty array when the MongoDB pets collection has no records.

## Requirements

- Node.js 20 or later
- npm
- MongoDB Atlas or another MongoDB connection string

## Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:5173
```

Keep `.env` private and do not commit it. For a deployed frontend, set `CORS_ORIGIN` to the frontend's exact origin (scheme and hostname, no path or trailing slash). Multiple allowed origins can be comma-separated.

## Run and build

Start the local development server:

```bash
npm run dev
```

It listens on `http://localhost:4000` by default.

Build and run the compiled server:

```bash
npm run build
npm start
```

Type-check without emitting files:

```bash
npm run typecheck
```

## API routes

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Backend status message. |
| GET | `/api/health` | Database health check. |
| GET | `/api/pets` | List pets from MongoDB. |
| GET | `/api/pets/:id` | Get a pet by its positive numeric ID. |
| GET | `/api/adopters` | List adopters from MongoDB. |
| GET | `/api/requests` | List adoption requests, newest first. |
| POST | `/api/requests` | Create an adoption request. |

For `POST /api/requests`, send JSON with `adopterName` and either `petId` or `petName`. Optional fields include `adopterAddress`, `adopterContact`, `adopterGithub`, and `requestedDate`. A `petId` must match a pet already stored in MongoDB.

## Vercel deployment

Import this backend repository as its own Vercel project. Add these Environment Variables in Vercel:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random secret
- `CORS_ORIGIN` — exact deployed frontend origin

Redeploy after changing environment variables. The Vercel app entry is exported from `src/app.ts`; `src/server.ts` is used for local development.

## Database note

The API reads and writes MongoDB collections named `pets`, `adopters`, and `requests`. Add documents to the collections before expecting the list routes to show records. The frontend's sample data is separate from this database.
