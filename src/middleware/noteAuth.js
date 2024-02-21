import { Note } from "../models/note.model.js";

 
/**
 * Middleware function to authenticate the user's access to a note. 
 */
async function noteAuth(req, res, next) {
    try {
        const noteID  = req.params.id;
        if (!noteID) {
            res.status(400).send({ msg: 'Bad Request.' });
            return;
        }
        const note = await Note.findById(noteID);
        if (!note) {
            res.status(404).send({ msg: 'Note not found.' });
            return;
        }
        if (note.owner._id.toString() !== req.session.user._id.toString()) {
            res.status(401).send({ msg: 'You do not own that note!' });
            return;
        } 
        next();
    } catch (err) {
        res.status(404).send({ msg: 'Note not found.' });
        return;
    } 
}

export { noteAuth };

