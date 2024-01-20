function userAuth (req, res, next) {
    console.log('Authenticating user...\n' + req.sessionID);
    if (!req.session.isAuth) {
        res.status(401).json('Unauthorized'); 
        return;
    } 
    next();
}

export { userAuth };

