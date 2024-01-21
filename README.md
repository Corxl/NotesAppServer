# Server for Notes App

This is the server side of the Notes App. It's built with Node.js and Express, and it provides API endpoints for user authentication and note management.

## Structure

The server is structured as follows:

- `src/`: Contains the main server code.
  - `middleware/`: Contains middleware functions.
    - `userAuth.js`: Middleware for user authentication.
  - `models/`: Contains Mongoose models.
    - `note.model.js`: Mongoose model for notes.
    - `user.model.js`: Mongoose model for users.
  - `routes/`: Contains Express routes.
    - `userRoute.js`: Express routes for user-related operations.
  - `server.js`: The main server file.
- `crud_tests/`: Contains REST API tests.
  - `user.rest`: Tests for user-related API endpoints.

## Setup

1. Install dependencies:

```sh
npm install
