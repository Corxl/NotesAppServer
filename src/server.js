import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import { router as userRouter } from './routes/userRoute.js';

import { User } from './models/user.model.js';

const app = express();
const parser = bodyParser.json(); 
dotenv.config(); 

// // Might not need this.
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
// 	res.setHeader('Access-Control-Allow-Headers', '*');
// 	res.header('Access-Control-Allow-Credentials', true);
// 	next();
// });

app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
		optionSuccessStatus: 200,
		api: {
			allowedHeaders: [
				'Content-Type',
				'Authorization',
				'Access-Control-Allow-Credentials',
			],
			exposedHeaders: ['Authorization'],
		},
	})
); 

app.use(
	session({
		name: 'login',
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }, // 1 year
		resave: false,
		httpOnly: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
	})
);

async function connect() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.log(err);
	}
}
connect(); 

(async ()=>{
	const exists = await User.exists({username: 'test'});
	if (exists) return;

	await User.create({
		username: 'test',
		password: 'test',
	});
})()

app.use(parser); 

app.use('/users', userRouter);

app.use('/ping', (req, res) => {
	res.status(200).send('pong');
});

http.createServer(app).listen(3001, () => {
    console.log('Listening on port 3001');
});