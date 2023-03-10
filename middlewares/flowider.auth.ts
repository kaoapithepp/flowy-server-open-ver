import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// model
import Flowider from "../models/Flowider.model";

// interface
import { JwtPayload, CustomRequest } from "../interfaces/iauth.interface";

dotenv.config();

export async function flowiderAuth(req: Request, res: Response, next: NextFunction) {
    let token;

    // console.log('See token:' + req.headers.authorization);

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log('Splitted:' + token);
            
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
            // console.log('Decoded:' + decoded.id);

            (req as CustomRequest).user = await Flowider.findOne({ where: { flowider_id: decoded.id}});

            next();

        } catch(err: any) {
            res.status(403).send("Not authorized, token failed.");
        }
    }

    // no token
    if(!token) res.status(404).send("Not authorized, no token.");
}