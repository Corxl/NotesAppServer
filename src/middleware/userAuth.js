function userAuth (req, res, next) { 
    if (!req.session.isAuth) {
        res.status(401).json('Unauthorized'); 
        console.log(`Unauthorized | ${req.sessionID}`);
        return;
    } 
    console.log(`Authorized | ${req.sessionID}`);
    next();
}

export { userAuth };

