import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

// models
import User from "../models/User.model";

// interfaces
import { IUser } from "../interfaces/iuser.interface";

// utils
import generateToken from "../utils/generateToken";
import { uploadImage } from "../utils/uploadImage";

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
        if(!user) throw new Error("Username doesn't exist!");
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
                        // development
                        flowiderInfo: user
                    })
                }
            })
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
    
}

export async function getUserByIdController(req: Request, res: Response) {
    console.log();
    const user = await User.findOne({
        attributes: { exclude: ['password'] }, 
        where: { user_id: (req as any).user.user_id } 
    });

    if(!user) throw new Error("Username doesn't exist!");
    if(user){
        res.status(200).json(user);
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

export async function uploadProfileImageUserController(req: Request, res: Response, next: NextFunction){
    try {
        const user_id = req.params.id;
        const imageURIs: string[] | any = await uploadImage(req, res, next);
        
        if(!imageURIs){
            res.status(401).json("Something went wrong.");
        }

        const updatedUser = await User.findOne<IUser>({
            where: { user_id: user_id }
        });

        if(updatedUser){
            (updatedUser as IUser).profile_imgUrl = imageURIs[0];

            await updatedUser.save();

            res.status(201).json({
                message: "Your attachment has been upload successfully.",
            });
        }

    } catch(err: any) {
        throw new Error(err.message);
    }
}