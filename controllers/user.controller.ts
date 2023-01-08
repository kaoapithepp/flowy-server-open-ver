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

    const email_check_query = `
        SELECT user_id
        FROM users
        WHERE LOWER(email) = LOWER(${email})
    `;

    db.query(email_check_query, (err, result) => {
        // if user exists
        if(result){
            return res.status(409).send({
                message: "Username is already in used."
            });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                const create_query = `
                    INSERT INTO users (user_id, first_name, last_name, email, password, tel_no, createAt)
                    VALUES ('${uuid()}', '${first_name}', '${last_name}', '${email}', '${hash}', '${tel_no}', CONVERT_TZ(now(), '+00:00', '+07:00'))
                `;

                db.query(create_query, (err, result) => {
                    if(err) res.send({ 
                        message: err.message
                    });
                    
                    return res.status(201).send({
                        message: "Account is signed up successfully!"
                    })
                });
            });
            
        }
    });
    
}

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    const get_all_users_query = `
        SELECT *
        FROM users
    `;
    db.query(get_all_users_query, (err, result) => {
        res.send(result);
    });
}