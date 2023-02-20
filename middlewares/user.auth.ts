import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// model
import User from "../models/User.model";

// interface
import { CombinedIUser } from "../interfaces/iuser.interface";

dotenv.config();

interface JwtPayload {
    id: string
}

interface CustomRequest extends CombinedIUser {
    token: string | jwt.JwtPayload;
    user?: any;
}


export async function userAuth(req: Request, res: Response, next: NextFunction) {
    let token;

    // console.log('See token:' + req.headers.authorization);

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log('Splited:' + token);
            
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
            // console.log('Decoded:' + decoded.id);

            (req as CustomRequest).user = await User.findOne({ where: { user_id: decoded.id}});

            next();

        } catch(err: any) {
            throw new Error("Not authorized, token failed.");
        }
    }

    // no token
    if(!token) throw new Error("Not authorized, no token.");
}