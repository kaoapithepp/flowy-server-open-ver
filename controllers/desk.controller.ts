import { Request, Response, NextFunction } from "express";

// models
import Desk from "../models/Desk.model";

export async function createDeskController(req: Request, res: Response) {
    try {
        const { desk_name,
            description,
            desk_type,
            min_seat,
            max_seat } = req.body;

        const placeId = req.params.place_id;

        const createdDesk = await Desk.create({
            desk_name: desk_name,
            description: description,
            desk_type: desk_type,
            min_seat: min_seat,
            max_seat: max_seat,
            place_id: placeId
        });

        if(createdDesk) {
            res.status(201).json({
                status: "Desk has been created successfully!",
                desk_info: createdDesk 
            })
        }

    } catch(err: any) {
        throw new Error(err.message);
    }
}

export async function getDeskByIdController(req: Request, res: Response) {
    try {
        

    } catch(err: any) {
        throw new Error(err.message);
    }
}

export async function deleteDeskByIdController(req: Request, res: Response) {
    try {

    } catch(err: any) {
        throw new Error(err.message);
    }
}

export async function getAllDesksNoAuthController(req: Request, res: Response) {
    try {
        const results = await Desk.findAll();

        res.status(200).json(results);
        
    } catch(err: any) {
        throw new Error(err.message);
    }
}