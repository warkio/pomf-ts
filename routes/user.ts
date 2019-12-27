import { Router, Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import HttpException from "../exceptions/HttpException";
import {db} from '../lib/database';

const userRoutes = Router();


userRoutes.post('/register', (req: Request, res: Response, next: NextFunction) => {
    if(!res.locals.serverConfig.registerEnabled) {
        return next(new HttpException(400, 'Register is currently disabled'));
    }
    const { username } = req.body;
    const { password } = req.body;
    if(!username || !password) {
        return next(new HttpException(400, 'Username and password are required'));
    }
    db.task(async t => {
        const userExistence = (await t.query('SELECT id FROM users WHERE username=$1', [username])).length > 0;
        if(userExistence) {
            return next(new HttpException(400, 'Username already exists'));
        }
        const userCreation = await t.query(
            'INSERT INTO users(username, password) VALUES ($1, $2) RETURNING api_key',
            [username, bcrypt.hashSync(password, 10)]
        );
        return res.status(200).send({
            success: true,
            key: userCreation[0].api_key
        });
    });
});


userRoutes.post('/reset-key', (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const { password } = req.body;
    if(!username || !password) {
        return next(new HttpException(400, 'Username and password are required'));
    }
    db.task(async t => {
        const userSearch = await t.query('SELECT * FROM users WHERE username=$1', [username]);
        const userExistence = userSearch.length > 0;
        if(!userExistence) {
            return next(new HttpException(400, 'Invalid credentials'));
        }
        if(bcrypt.compareSync(password, userSearch[0].password)) {
            const updatedUser = await t.query('UPDATE users SET api_key=uuid_generate_v4() WHERE id=$1 RETURNING *', [userSearch[0].id]);
            return res.status(200).send({
                success: true,
                key: updatedUser[0].api_key
            });
        }
        else {
            return next(new HttpException(400, 'Invalid credentials'));
        }
    });
});

export default userRoutes;