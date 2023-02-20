import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

// models
import User from "../models/User.model";

// utils
import generateToken from "../utils/generateToken";

export async function registerUserController(req: Request, res: Response) {
    try {
        const { email, password, tel_no } = req.body;

        const isUserExist = await User.findOne({
            where: { email: email }
        });

        // validations
        if(isUserExist) throw new Error("Username already exists!");
        if(!password || !tel_no) throw new Error("Please provide all necessary information completely.");

        const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: await bcrypt.hash(req.body.password, 10),
            tel_no: req.body.tel_no,
            email: req.body.email,
            cc_card: req.body.cc_card
        });

        if(user){
            // development
            res.status(201).json(user);
        } else {
            res.status(400);
            throw new Error("Bad request!");
        }

        console.log(user);

    } catch(err: any) {
        throw new Error(err);
    }
}

export async function loginUserController(req: Request, res: Response){
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email: email }
        });

        // validations
        if(!user) throw new Error("Username doesn't exists!");
        if(user){
            bcrypt.compare(password, user["password"], (bcErr, bcRes) => {
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
                        token: generateToken(user["user_id"]),
                        flowiderInfo: user
                    })
                }
            })
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
    
}

export async function getAllUserController(req: Request, res: Response) {
    try {
        const allUsers = await User.findAll();

        console.log(allUsers)

        res.status(200).json(allUsers);
        
    } catch(err: any) {
        throw new Error(err);
    }
}