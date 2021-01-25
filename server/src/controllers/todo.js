import jwt from 'jsonwebtoken';

import app from '../index.js';

export function authenticateJWT(req, res, next) {
    const token = req.cookies.auth;

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.username = decoded.username;
        next();
    });
}

export async function createTodo(req, res) {
    const { description } = req.body;

    const [{ id: user_id }] = await app.knex('users').select('id').where({
        username: req.username,
    });

    await app.knex('todos').insert({ description, user_id });

    res.end();
}
