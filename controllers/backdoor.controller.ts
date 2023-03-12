import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/configDB";

// models
import Amenity from "../models/Amenity.model";
import ImagePool from "../models/ImagePool.model";
import Specification from "../models/Specification.model";

export async function getAllAmenityBackdoor(req: Request, res: Response) {
    try {
        const result = await Amenity.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        res.status(400).send("Get all amenity failed!");
        throw new Error("Get all amenity failed!");
    }
}

export async function getAllSpecBackdoor(req: Request, res: Response) {
    try {
        const result = await Specification.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        res.status(400).send("Get all specs failed!");
        throw new Error("Get all specs failed!");
    }
}

export async function getAllImagesBackdoor(req: Request, res: Response) {
    try {
        const result = await ImagePool.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        res.status(400).send("Get all images failed!");
        throw new Error("Get all images failed!");
    }
}

export async function getAllTimeslot(req: Request, res: Response){
    try {
        const [result] = await sequelize.query(`
            SELECT *
            FROM Timeslot
            WHERE SUBSTRING(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+07:00'), 1, 10)
                = SUBSTRING(CONVERT_TZ(\`createdAt\`, '+00:00', '+07:00'), 1, 10)
        `);

        res.send(result);
    } catch(err: any) {
        res.status(400).send("Get all timeslots failed!");
        throw new Error("Get all timeslots failed!");
    }
}