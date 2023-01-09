import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { db } from '../config/configDB';

import { IFlowider } from '../interfaces/iflowider.interface';

interface JWTMergingType extends JwtPayload {
    id: string;
}

const protect = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // verify token by checking token with secret message
            // Token only contains { id } because we assign it in utils/generateToken.ts
            const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as JWTMergingType;

            db.query<IFlowider[]>(`
                SELECT *
                FROM flowiders
                WHERE flowider_id = ${db.escape(id)}
            `, (err, result) => {
                if (err) {
                    res.send("Error");
                }

                if(result.length == 0) {
                    res.status(401).send({
                        message: "Not authorized, Flowider account not found."
                    });
                }
                
                req.user = result;
                next();
            });

        } catch (err) {
            res.status(401).send({
                message: "Not authorized, token failed."
            });
        }
    }

    if(!token) {
        res.status(401).send({
            message: "Not authorized, no token."
        });

    }
}

export default protect;