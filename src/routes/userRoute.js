import bodyParser from 'body-parser';
import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { Note } from '../models/note.model.js';
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

router.post("/logout", userAuth, async (req, res) => {
    try { 
        console.log(`User(${req.session.user.username}) logged out.`); 
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
        const u = await User.findById(user._id).populate('notes');
        res.status(200).json(u.notes);
    } catch (err) {
        res.status(500).send({ msg: 'Server Error.' });
    }
});

router.post("/addNote", userAuth, async (req, res) => {
    try {
        const { user } = req.session;
        const note = await Note.create({
            title: "Untitled Note",
            content: " ",
            owner: user._id,
        });
        await User.findByIdAndUpdate(user._id, { $push: { notes: note._id } });
        res.status(200).json({title: note.title, content: note.content, id: note._id});
        console.log(`Note: ${note._id} added.`)
    } catch (err) {
        console.log("failed to add note.")
        console.log(err);
        res.status(500).send({ msg: 'Server Error.' });
    }
});

router.post("/deleteNote", userAuth, async (req, res) => {
    try {
        const { user } = req.session;
        const noteId = req.params.id;
        const { notesToDelete } = req.body;
        if (!notesToDelete) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        if (notesToDelete.length === 0) {
            res.status(200).send({ msg: 'No notes to delete.' });
            return;
        } 
        const notes = await Note.find({ _id: { $in: notesToDelete } });
        console.log(notes);
        //await Note.deleteMany({ _id: { $in: notesToDelete } });
        res.status(200);
        
        
        //res.status(200).send({ msg: 'Note deleted.' });
        return;

    } catch (err) {
        console.log(err);
        res.status(404).send({ msg: 'Note not found.' });
    }
});

router.post("/updateNote", userAuth, async (req, res) => {
    console.log("updateNote");
    try {
        const { title, content, id } = req.body;
        console.log(id);
        console.log(req.params)
        console.log(req.body);
        if (!id) {
            console.log("no id");
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        const note = await Note.findById(id); 
        if (title) note.title = title;
        if (content) note.contents = content;
        note.save();
        console.log(note);
        // await Note.findByIdAndUpdate(noteId, { title: title, content: content }); 
        // console.log(`Note: ${noteId} updated.`)
        res.status(200).send({ note: { title: note.title, content: note.contents } });
    } catch (err) {
        res.status(404).send({ msg: 'Note not found.' });
    }
});

router.get("/isAuth", userAuth, async (req, res) => { 
    res.status(200).json({msg: "Authenticated."});
});

router.get("/protected", userAuth, async (req, res) => {
    console.log(req.session.user)
    res.json({msg: 'You are authenticated!'});
});


export { router };

