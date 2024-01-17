function userAuth (req, res, next) {
    if (!req.session.isAuth) {
        res.status(401).json('Unauthorized');
        return;
    } 
    next();
}

export { userAuth };

