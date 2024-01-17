import bodyParser from 'body-parser';
import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { User } from '../models/user.model.js';

const router = express.Router();
const parser = bodyParser.json();

router.post("/login", async (req, res) => {
   try {
        console.log(req.sessionID);
        const { username, password } = req.body; 
        if (!username || !password) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        if (req.session.authenticated) {
            console.log('already authenticated');
            res.json(req.session);
            return;
        }
        const exists = await User.exists({
            username: username,
            password: password,
        });
        if (!exists) {
            res.status(400).send({ msg: 'Invalid username or password.' });
            return;
        } 
        req.session.isAuth = true;
        const user = await User.findOne({ username: username, password: password }); // change to get and then compare the password.
        req.session.user = user;
        res.status(200).json(req.session);
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.get("/protected", userAuth, async (req, res) => {
    console.log(req.session.user)
    res.json({msg: 'You are authenticated!'});
});


export { router };

