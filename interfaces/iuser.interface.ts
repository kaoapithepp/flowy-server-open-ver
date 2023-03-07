import { Request } from "express";
import { Model } from "sequelize";

export interface IUser extends Model {
    email: string;
    password: string;
    user_id: string;
    first_name: string;
    last_name: string;
    tel_no: string;
    profile_imgUrl: string;
}

export interface IUserAuth extends IUser {
    user?: any;
}

export type CombinedIUser = Request & IUserAuth;