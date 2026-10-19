# PAWHOME Cacao Backend

Express and TypeScript API for the PAWHOME pet adoption frontend. Mongoose connects the API to MongoDB Atlas and stores pets, adopters, and adoption requests in separate collections.

## Requirements

- Node.js 20+
- npm
- A MongoDB Atlas database or compatible MongoDB connection string

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env` and set the values:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:5173
```

Keep `.env` private and out of Git. `CORS_ORIGIN` may contain multiple comma-separated frontend origins. The API connects to MongoDB when an API request arrives.

## Run and build

```bash
npm run dev
```

The development server listens on `http://localhost:4000` by default.

```bash
npm run build
npm start
```

Other available command:

```bash
npm run typecheck
```

## API routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Basic backend status message. |
| `GET` | `/api/health` | Database health response. |
| `GET` | `/api/pets` | List pets. Returns an empty array when the `pets` collection has no records. |
| `GET` | `/api/pets/:id` | Get one pet by numeric ID. |
| `GET` | `/api/adopters` | List adopters. |
| `GET` | `/api/requests` | List adoption requests, newest first. |
| `POST` | `/api/requests` | Create an adoption request. Provide a JSON body with `adopterName` and either `petId` or `petName`; other adopter details are optional. |

The API uses the `pets`, `adopters`, and `requests` MongoDB collections. Add records to those collections before expecting the list endpoints to return data.

## Vercel deployment

Import this repository as a Vercel project. Configure `MONGODB_URI` and `CORS_ORIGIN` in the project's Environment Variables. Set `CORS_ORIGIN` to the exact frontend origin, without a path or trailing slash. Redeploy after changing environment variables.

The Express application is exported from `src/app.ts` for Vercel; `src/server.ts` is the local development entry point.
