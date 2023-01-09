import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';

import { db }  from '../config/configDB';

// interfaces
import { IUser } from '../interfaces/iuser.interface';

// uitls
import generateToken from '../utils/generateToken';

// sign-up
export const signUp = (req: Request, res: Response, next: NextFunction ) => {

    const { first_name,
            last_name, 
            email,
            password,
            tel_no } = req.body;

    const existingEmailQuery = `
        SELECT user_id
        FROM users
        WHERE LOWER(email) = LOWER(${email})
    `;

    db.query(existingEmailQuery, (err, result) => {
        // if user exists
        if(!result){
            return res.status(409).send({
                message: "Username is already in used."
            });
        }
        
        bcrypt.hash(password, 10, (err, hash) => {
            const createUserQuery = `
                INSERT INTO users (user_id, first_name, last_name, email, password, tel_no, createAt)
                VALUES ('${uuid()}', '${first_name}', '${last_name}', '${email}', '${hash}', '${tel_no}', '${new Date()}')
            `;

            db.query(createUserQuery, (err, result) => {
                if(err) throw err;
                
                return res.status(201).send({
                    message: "Account is signed up successfully!"
                })
            });
        });
    });
    
}

// sign-in
export const signIn = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    const checkEmailQuery = `
        SELECT *
        FROM users
        WHERE email = ${db.escape(email)}
    `;
    
    db.query<IUser[]>(checkEmailQuery, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length == 0) {
            return res.status(404).send({
                status: "invalid",
                message: "Email is incorrect!"
            });
        }

        bcrypt.compare(password, result[0]["password"], (bcErr, bcRes) => {
            if (bcErr) throw bcErr.message;

            if (!bcRes) {
                res.status(403).send({
                    status: "invalid",
                    message: "Wrong password!"
                })
            }

            if (bcRes) {
                return res.status(200).send({
                    status: "ok",
                    token: generateToken(result[0]["user_id"]),
                    userInfo: result[0]
                })
            }
        })
        
    });
}

// get all users
export const getAllUsers =  (req: Request, res: Response, next: NextFunction) => {
    const getAllUsersQuery = `
        SELECT *
        FROM users
    `;

    db.query(getAllUsersQuery, (err, result) => {
        if (err) return err.message;

        res.status(201).send(result);
    });
}