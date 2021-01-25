import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../index.js';

export async function handleRegister(req, res) {
    const { username, password } = req.body;

    const queryResult = await app.knex('users').select('*').where({
        username,
    });

    if (queryResult.length > 0)
        return res.status(409).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await app.knex('users').insert({
        username,
        password: hashedPassword,
    });

    const token = jwt.sign({ username }, process.env.SECRET);

    res.cookie('auth', token, { maxAge: 3600, httpOnly: true });

    return res.end();
}

export async function handleLogin(req, res) {
    const { username, password } = req.body;

    const queryResult = await app
        .knex('users')
        .select('username', 'password')
        .where({
            username,
        });

    if (queryResult.length === 0)
        return res
            .status(401)
            .json({ error: 'Invalid username/password combination' });

    const [{ username: dbUsername, password: dbPassword }] = queryResult;

    const validPassword = await bcrypt.compare(password, dbPassword);

    if (!validPassword)
        return res
            .status(401)
            .json({ error: 'Invalid username/password combination' });

    const token = jwt.sign({ username: dbUsername }, process.env.SECRET);

    res.cookie('auth', token, { maxAge: 3600, httpOnly: true });

    return res.end();
}
