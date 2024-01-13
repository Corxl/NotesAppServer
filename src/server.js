import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';


const app = express(); 
const parser = bodyParser.json(); 

app.use(parser); 

app.use('/users', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { 
        res.status(400).send('Incorrect payload'); 
    }
    res.send(`User ${email} logged in with password ${password}`);
});


http.createServer(app).listen(3000, () => {
    console.log('Listening on port 3000');
});