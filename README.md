# PAWHOME — Pet Adoption Platform

PAWHOME is a pet adoption website where users can browse pets, view pet details, and submit adoption requests. It also includes an AI Project Review page that gives feedback on a project description.

## Live application

- **Frontend:** [https://itelect4-project-cacao-it-4-b.vercel.app/](https://itelect4-project-cacao-it-4-b.vercel.app/)
- **Backend API:** [https://itelect4-backend-cacao.vercel.app/](https://itelect4-backend-cacao.vercel.app/)
- **Backend health check:** [https://itelect4-backend-cacao.vercel.app/api/health](https://itelect4-backend-cacao.vercel.app/api/health)

Open the frontend homepage and use its navigation to visit **AI Review**.

## Source code

- **Frontend repository:** [itelect4-project-cacao-IT4B](https://github.com/angelaa013/itelect4-project-cacao-IT4B)
- **Backend repository:** [itelect4-backend-cacao](https://github.com/angelaa013/itelect4-backend-cacao)

## Technologies

- React and TypeScript
- Vite
- Express and TypeScript
- MongoDB with Mongoose
- Google Gemini API

## Features

- Browse pets and view pet details
- View adopters and adoption requests
- Submit adoption requests
- Describe a project and receive AI-generated strengths, improvements, and a readiness rating

The frontend currently uses sample data from `src/data/mockData.ts` for its pet, adopter, and request pages. The AI Project Review feature sends its request to the backend API.

## Run locally

You need Node.js, npm, and a MongoDB connection string.

### 1. Start the backend

Clone the backend repository and install its dependencies:

```bash
git clone https://github.com/angelaa013/itelect4-backend-cacao.git
cd itelect4-backend-cacao
npm install
```

Create a `.env` file in the backend folder using `.env.example` as a guide:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Keep your `.env` file and API keys private. Do not commit them to GitHub.

### 2. Start the frontend

In a separate terminal, clone the frontend repository and install its dependencies:

```bash
git clone https://github.com/angelaa013/itelect4-project-cacao-IT4B.git
cd itelect4-project-cacao-IT4B
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=
VITE_USE_MOCK_DATA=false
```

Leave `VITE_API_URL` blank for local development. Vite will proxy API requests to the backend at `http://localhost:4000`.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check backend and database status |
| GET | `/api/pets` | List pets |
| GET | `/api/pets/:id` | Get a pet by ID |
| GET | `/api/adopters` | List adopters |
| GET | `/api/requests` | List adoption requests |
| POST | `/api/requests` | Create an adoption request |
| POST | `/api/ai` | Review a project description with Gemini |

## Deployment configuration

In the **frontend Vercel project**, set:

```env
VITE_API_URL=https://itelect4-backend-cacao.vercel.app
VITE_USE_MOCK_DATA=false
```

In the **backend Vercel project**, configure `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, and `GEMINI_API_KEY`. Set `CORS_ORIGIN` to:

```text
https://itelect4-project-cacao-it-4-b.vercel.app
```

Redeploy the relevant Vercel project after changing its environment variables.