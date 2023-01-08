import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';
import jwt from 'jsonwebtoken';

import { db } from '../config/configDB';

// sign-up
export const signUp = (req: Request, res: Response, next: NextFunction ) => {

    const { first_name,
            last_name, 
            email,
            password,
            tel_no } = req.body;

    const query = `
        SELECT id
        FROM users
        WHERE LOWER(email) = LOWER(${email})
    `;

    db.query(query, (err, result) => {
        console.log(result);
        // if user exists
        if(result){

            return res.status(409).send({
                message: "Username is already used."
            });

        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                const create_query = `
                    INSERT INTO users (user_id, first_name, last_name, email, password, tel_no, createAt)
                    VALUES ('${uuid()}', '${first_name}', '${last_name}', '${email}', '${hash}', '${tel_no}', '${new Date()}')
                `;

                db.query(create_query, (err, result) => {
                    if(err) res.send(err.message);
                    
                    return res.status(201).send({
                        message: "Account is signed up successfully!"
                    })
                });
            });
            
        }
    });
    
}

export const signIn = (req: Request, res: Response, next: NextFunction) => {
    
}

// get all user
export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    const getAllUsersQuery = `
        SELECT *
        FROM users
    `;

    db.query(getAllUsersQuery, (err, result) => {
        res.status(200).send(result);
    });
}