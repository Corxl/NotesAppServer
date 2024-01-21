# Server for Notes App

This is the server side of the [Notes App](https://github.com/Corxl/NotesAppClient). It's built with Node.js and Express, and it provides API endpoints for user authentication and note management.

## Setup

1. Install dependencies: `npm install`

2. Create `.env` file

3. Add following lines into `.env`
  > SESSION_SECRET:`your-auth-sesson-secret`

  > MONGO_URI: `mongoDB-uri`

  Your `SESSION_SECRET` can be any random string

  Your `MONGO_URI` should look something like this: `mongodb://sally:sallyspassword@dbserver.example:5555/userdata?...`

## Start Server
Run: `npm start`

or to listen to changes: `npm run dev`



   


