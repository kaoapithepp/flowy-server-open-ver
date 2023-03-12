import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/configDB";

// models
import Timeslot from "../models/Timeslot.model";

export async function getAllTimeSlotByDeskId(req: Request, res: Response) {
    const deskId = req.params.deskId;
    try {
        const [resultsTimeslot] = await sequelize.query(`
            SELECT *
            FROM Timeslot
            WHERE desk_id = ?
                AND SUBSTRING(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+07:00'), 1, 10)
                = SUBSTRING(CONVERT_TZ(\`createdAt\`, '+00:00', '+07:00'), 1, 10)
            ORDER BY orderNo ASC;
        `, {
            replacements: [deskId]
        })

        res.status(200).send(resultsTimeslot);

    } catch(err: any) {
        res.status(400).send("Get all time slots failed!");
        throw new Error("Get all time slots failed!");
    }
}