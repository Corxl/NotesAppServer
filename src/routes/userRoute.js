import bodyParser from 'body-parser';
import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { User } from '../models/user.model.js';
import { Note } from '../models/note.model.js';

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

router.post("/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send({ msg: 'Logged out.' });
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        const existsUsername = await User.exists({ username: username });
        if (existsUsername) {
            res.status(400).send({ msg: 'Username already exists.' });
            return;
        }

        const existsEmail = await User.exists({ email: email });
        if (existsEmail) {
            res.status(400).send({ msg: 'Email already exists.' });
            return;
        }

        await User.create({
            username: username,
            email: email,
            password: password,
        }); 

        // probably do not want automatically login in after registering. Wait for email verifation first.

        // req.session.isAuth = true;
        // req.session.user = user;
        res.status(200).json(req.session);
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.get("/getNotes", userAuth, async (req, res) => {
    try {
        const { user } = req.session;
        const notes = await User.findById(user._id).populate('notes');
        res.status(200).json(notes);
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.post("/addNote", userAuth, async (req, res) => {
    try {
        const { user } = req.session;
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        const note = await Note.create({
            title: title,
            content: content,
        });
        await User.findByIdAndUpdate(user._id, { $push: { notes: note._id } });
        res.status(200).json(note);
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.post("/deleteNote", userAuth, async (req, res) => {
    try {
        const { user } = req.session;
        const { noteId } = req.body;
        if (!noteId) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        await Note.findByIdAndDelete(noteId);
        await User.findByIdAndUpdate(user._id, { $pull: { notes: noteId } });
        res.status(200).send({ msg: 'Note deleted.' });
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.get("/isAuth", async (req, res) => {
    try {
        if (req.session.isAuth) {
            res.status(200).send({ msg: 'Authenticated.' });
            return;
        }
        res.status(401).send({ msg: 'Not authenticated.' });
    } catch (err) {
        res.status(400).send({ msg: 'Bad Request.' });
    }
});

router.get("/protected", userAuth, async (req, res) => {
    console.log(req.session.user)
    res.json({msg: 'You are authenticated!'});
});


export { router };

