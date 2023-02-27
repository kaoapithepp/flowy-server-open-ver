import jwt from "jsonwebtoken";
import { CombinedIUser } from "./iuser.interface";

export interface JwtPayload {
    id: string
}

export interface CustomRequest extends CombinedIUser {
    token: string | jwt.JwtPayload;
    user?: any;
}