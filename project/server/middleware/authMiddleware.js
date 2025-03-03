import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; 

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Доступ заборонено' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Недійсний токен' });

        req.user = user; 
        next();
    });
};