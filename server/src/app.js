import express from 'express';
import knex from 'knex';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.js';
import todoRouter from './routes/todo.js';

class App {
    constructor() {
        this.express = express();

        this.implementMiddleware();
        this.connectDatabase();
        this.implementRoutes();
    }

    implementMiddleware() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());
    }

    async connectDatabase() {
        this.knex = knex({
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            },
        });

        await this.knex.schema
            .dropTableIfExists('todos') // Must drop first because of foreign key
            .dropTableIfExists('users')
            .createTable('users', (table) => {
                table.increments('id');
                table.string('username');
                table.string('password');
            })
            .createTable('todos', (table) => {
                table.increments('id');
                table.string('description');
                table.boolean('completed').defaultTo(false);
                table.integer('user_id').unsigned().references('users.id');
            });
    }

    implementRoutes() {
        this.express.use('/api', userRouter);
        this.express.use('/api', todoRouter);

        this.express.use((err, req, res, next) => {
            console.error(err);
            res.status(500).send('Something broke!');
        });
    }
}

export default App;
