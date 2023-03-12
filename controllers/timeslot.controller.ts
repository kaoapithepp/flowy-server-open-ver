import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/configDB";

// models
import Timeslot from "../models/Timeslot.model";

export async function getAllTimeSlotByDeskId(req: Request, res: Response) {
    const deskId = req.params.deskId;
    const currentDate = new Date().toISOString().substr(0,10);
    try {
        const [resultsTimeslot] = await sequelize.query(`
            SELECT *
            FROM Timeslot
            WHERE createdAt LIKE ?
                AND desk_id = ?
            ORDER BY orderNo ASC;
        `, {
            replacements: [`${currentDate}%`, deskId]
        })

        res.status(200).send(resultsTimeslot);

    } catch(err: any) {
        res.status(400).send("Get all time slots failed!");
        throw new Error("Get all time slots failed!");
    }
}