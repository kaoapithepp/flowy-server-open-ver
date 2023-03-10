import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

// models
import Flowider from "../models/Flowider.model";

// utils
import generateToken from "../utils/generateToken";
import { uploadImage } from "../utils/uploadImage";
import { IFlowider } from "../interfaces/iflowider.interface";

export async function registerFlowiderController(req: Request, res: Response) {
    try {
        const { email, password, tel_no } = req.body;

        const isFlowderExist = await Flowider.findOne({
            where: { email: email }
        });

        // validations
        if(isFlowderExist) res.status(400).send("Flowider account already exists!");
        if(!password || !tel_no) res.status(400).send("Please provide all necessary information completely.");

        const flowider = await Flowider.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: await bcrypt.hash(req.body.password, 10),
            tel_no: req.body.tel_no,
            email: req.body.email,
            cc_card: req.body.cc_card
        });

        if(flowider){
            // development
            res.status(201).json(flowider);
        } else {
            res.status(400).send("Bad request!");
        }

    } catch(err: any) {
        res.status(err.status).send(err.message);
    }
}

export async function uploadProfileImageFlowiderController(req: Request, res: Response, next: NextFunction){
    try {
        const flowider_id = req.params.id;
        const imageURIs: string[] | any = await uploadImage(req, res, next);
        
        if(!imageURIs){
            res.status(401).json("Something went wrong.");
        }

        const updatedFlowider = await Flowider.findOne<IFlowider>({
            where: { flowider_id: flowider_id }
        });

        if(updatedFlowider){
            (updatedFlowider as IFlowider).profile_imgUrl = imageURIs[0];

            await updatedFlowider.save();

            res.status(201).json({
                message: "Your attachment has been upload successfully.",
            });
        }

    } catch(err: any) {
        res.status(err.status).send(err.message);
    }
}
    

export async function loginFlowiderController(req: Request, res: Response){
    try {
        const { email, password } = req.body;

        const flowider = await Flowider.findOne({
            where: { email: email }
        });

        // validations
        if(!flowider) res.status(404).send("Username doesn't exist!");
        if(flowider){
            bcrypt.compare(password, flowider["password"], (bcErr, bcRes) => {
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
                        token: generateToken(flowider["flowider_id"]),
                        // development
                        flowiderInfo: flowider
                    })
                }
            })
        }
    } catch (err: any) {
        res.status(err.status).send(err.message);
    }
    
}

export async function getFlowiderByIdController(req: Request, res: Response) {
    const flowider = await Flowider.findOne({
        attributes: { exclude: ['password'] }, 
        where: { flowider_id: (req as any).user.flowider_id } 
    });

    if(!flowider) res.status(404).send("Flowider account doesn't exist!");
    if(flowider){
        res.status(200).json(flowider);
    }
}

export async function getAllFlowiderController(req: Request, res: Response) {
    try {
        const allFlowiders = await Flowider.findAll();

        res.status(200).json(allFlowiders);
        
    } catch(err: any) {
        res.status(err.status).send(err.message);
    }
}