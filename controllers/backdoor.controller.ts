import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/configDB";

import Amenity from "../models/Amenity.model";
import Specification from "../models/Specification.model";

export async function getAllAmenityBackdoor(req: Request, res: Response) {
    try {
        const result = await Amenity.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
}

export async function getAllSpecBackdoor(req: Request, res: Response) {
    try {
        const result = await Specification.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
}