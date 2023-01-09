import { Request, Response, NextFunction } from 'express';
import { uuid } from 'uuidv4';
import bcrypt from 'bcrypt';

import { db } from '../config/configDB'

// interfaces
import { IFlowider } from '../interfaces/iflowider.interface';

// utils
import generateToken from '../utils/generateToken';

export const flowiderSignUp = (req: Request, res: Response, next: NextFunction) => {
    const { first_name,
            last_name, 
            email,
            password,
            tel_no,
            bnk_acc,
            bnk_name } = req.body;

    const checkFlowiderEmailQuery = `
        SELECT id
        FROM flowiders
        WHERE LOWER(email) = LOWER(${db.escape(email)})
    `;

    db.query<IFlowider[]>(checkFlowiderEmailQuery, (err, result) => {
        if (err) throw err.message;

        if (result.length) {
            res.status(400).send({
                message: "User already exists!"
            });
        }

        bcrypt.hash(password, 10, (err, hash_pw) => {
            const createFlowiderQuery = `
                INSERT INTO flowiders (flowider_id, first_name, last_name, email, password, tel_no, bnk_acc, bnk_name, createAt)
                VALUES ('${uuid()}','${first_name}', '${last_name}', '${email}', '${hash_pw}', '${tel_no}', '${bnk_acc}', '${bnk_name}', '${new Date()}')
            `;

            db.query<IFlowider[]>(createFlowiderQuery, (err, hash) => {
                if (err) throw err.message;

                res.status(201).send({
                    status: "ok",
                    message: "Flowider Account registered successfully!"
                });
            });
        })
    });

}

// sign-in
export const flowiderSignIn = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    const checkEmailQuery = `
        SELECT *
        FROM flowiders
        WHERE email = ${db.escape(email)}
    `;
    
    db.query<IFlowider[]>(checkEmailQuery, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length == 0) {
            return res.status(404).send({
                status: "invalid",
                message: "Email is incorrect!"
            });
        }

        // return res.status(200).send(result);

        bcrypt.compare(password, result[0]["password"], (bcErr, bcRes) => {
            if (bcErr) throw bcErr.message;

            if (!bcRes) {
                res.status(403).send({
                    status: "invalid",
                    message: "Wrong password!"
                })
            }

            if (bcRes) {
                return res.status(201).send({
                    status: "ok",
                    token: generateToken(result[0]["flowider_id"]),
                    flowiderInfo: result[0]
                })
            }
        })
        
    });
}

// get all flowiders
export const getAllFlowiders =  (req: Request, res: Response, next: NextFunction) => {
    const getAllFlowidersQuery = `
        SELECT *
        FROM flowiders
    `;

    db.query(getAllFlowidersQuery, (err, result) => {
        if (err) return err.message;

        res.status(201).send(result);
    });
}