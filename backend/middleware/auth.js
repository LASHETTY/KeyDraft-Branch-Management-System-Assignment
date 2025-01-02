const auth = (req, res, next) => {
    const { username, password } = req.headers;
    
    if (!username || !password) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (username === 'barath' && password === '12345') {
        next();
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

module.exports = auth;
