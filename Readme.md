# Review and Rate

A MERN-stack web application where users can list companies, post reviews, give star ratings, sort/search the list, and like or share individual reviews.

This project was built to satisfy the assignment described in `tasks.txt` and implements the user interface from the Figma prototype linked in that file.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Flow](#user-flow)
- [Notes](#notes)

---

## Features

- Add a new company through a modal dialog with fields for name, location, founded date, and city.
- Listing page that shows every company with its name, logo tile, address, description, average rating, total reviews, and founded date.
- Search by company name and filter by city directly from the listing toolbar.
- Sort the company list by name, rating, or date.
- Company detail page that opens when "Detail Review" is clicked.
- Add a review on the detail page through an inline form with full name, subject, review text, and a rating between 1 and 5.
- Average rating shown prominently above the review list.
- Sort reviews by date, rating, or relevance (likes).
- Like and share actions on each review, with counters that persist on the server.
- Responsive layout that adapts to small screens.

All of the bullet points listed in `tasks.txt` are implemented end to end.

---

## Tech Stack

Backend

- Node.js
- Express
- MongoDB with Mongoose
- CORS and dotenv

Frontend

- React 18
- React Router v6
- Vite as the build tool and dev server
- Plain CSS (no framework) for styling

---

## Project Structure

```
zoronal/
  backend/
    package.json
    .env.example
    src/
      server.js
      seed.js
      controllers/
        companyController.js
        reviewController.js
      models/
        Company.js
        Review.js
      routes/
        companyRoutes.js
        reviewRoutes.js
  frontend/
    package.json
    vite.config.js
    index.html
    .env.example
    src/
      main.jsx
      App.jsx
      index.css
      app.css
      components/
        Layout.jsx
        Header.jsx
        CompanyLogo.jsx
        ReviewerAvatar.jsx
        Stars.jsx
      contexts/
        SearchContext.jsx
      pages/
        HomePage.jsx
        CompanyDetailPage.jsx
      services/
        api.js
  tasks.txt
  Readme.md
```

---

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A running MongoDB instance, either local on port 27017 or any MongoDB Atlas connection string

To check installed versions:

```bash
node --version
npm --version
mongod --version
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/GudiyaVerma16/zoronal.git
cd zoronal
```

### 2. Backend setup

From the project root:

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env` if your MongoDB URI is different. The defaults are:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/review_rate
```

Optional: load some sample companies and reviews so the listing isn't empty on first run.

```bash
npm run seed
```

Start the backend in development mode (auto-restarts on file changes):

```bash
npm run dev
```

The API will be available at `http://localhost:5000`. A health check is exposed at `http://localhost:5000/api/health`.

### 3. Frontend setup

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite dev server is already configured to proxy `/api` requests to `http://localhost:5000`, so no extra configuration is required during development.

---

## Available Scripts

Backend (`backend/`)

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Start the API server with auto-reload on file changes |
| `npm start`     | Start the API server in production mode               |
| `npm run seed`  | Wipe and reload the database with sample data         |

Frontend (`frontend/`)

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 5173       |
| `npm run build`   | Build a production bundle into `dist/`       |
| `npm run preview` | Preview the production build locally         |

---

## Environment Variables

Backend (`backend/.env`)

| Variable      | Default                                        | Description                            |
| ------------- | ---------------------------------------------- | -------------------------------------- |
| `PORT`        | `5000`                                         | Port the Express server listens on     |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/review_rate`        | MongoDB connection string              |

Frontend (`frontend/.env`)

| Variable        | Default | Description                                                                                                    |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE` | empty   | Optional. When empty, the dev proxy is used. In production, set this to the absolute URL of your backend API. |

---

## API Reference

Base URL during development: `http://localhost:5000`

Companies

| Method | Path                  | Description                                                  |
| ------ | --------------------- | ------------------------------------------------------------ |
| `POST` | `/api/companies`      | Create a new company                                         |
| `GET`  | `/api/companies`      | List companies, supports `q`, `city`, `sort`, `order` query  |
| `GET`  | `/api/companies/:id`  | Get a single company including average rating and review count |

Supported `sort` values for companies: `name`, `rating`, `date`. Supported `order` values: `asc`, `desc`.

Reviews

| Method  | Path                                                | Description                                         |
| ------- | --------------------------------------------------- | --------------------------------------------------- |
| `GET`   | `/api/companies/:companyId/reviews`                 | List reviews for a company                          |
| `POST`  | `/api/companies/:companyId/reviews`                 | Add a new review                                    |
| `PATCH` | `/api/companies/:companyId/reviews/:id/like`        | Increment the like counter on a review              |
| `PATCH` | `/api/companies/:companyId/reviews/:id/share`       | Increment the share counter on a review             |

Supported `sort` values for reviews: `date`, `rating`, `relevance`. Supported `order` values: `asc`, `desc`.

Example create-company request:

```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Software",
    "city": "Indore, Madhya Pradesh, India",
    "location": "MG Road, Indore",
    "foundedOn": "2018-04-15",
    "description": "Custom software development."
  }'
```

Example create-review request:

```bash
curl -X POST http://localhost:5000/api/companies/<COMPANY_ID>/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "subject": "Great team",
    "reviewText": "Delivered on time and stayed in good communication.",
    "rating": 5
  }'
```

---

## User Flow

1. Open the listing page at `/`.
2. Use the city field, search box, and sort dropdown to refine the list.
3. Click `+ Add Company` to open the modal, fill in the four required fields, and click Save. The new company appears in the list immediately.
4. Click `Detail Review` on any card to open the company detail page.
5. On the detail page, click `+ Add Review`, fill in the review form, and submit. The review appears in the list and the average rating updates.
6. On any review, click the heart icon to like it or the share icon to share its link and bump the share counter.
7. Use the Sort dropdown above the review list to reorder by date, rating, or relevance.

---

## Notes

- SignUp and Login are visual placeholders only. The assignment did not require authentication, so no user accounts are managed by the backend.
- Logos are rendered as colored tiles with the company's initials. There is no file upload step. A logo URL and tile color can optionally be sent to the backend if you choose to extend the create flow.
- Like and share counters are anonymous. There is no per-user deduplication, since users are not modelled.
- Average ratings on the listing and detail screens are computed from real data via MongoDB aggregation, not stored on the company document.
- The frontend uses a small fetch wrapper in `src/services/api.js`. There is no global state library; each page fetches the data it needs.
