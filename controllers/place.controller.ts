import { Request, Response, NextFunction } from "express";
import { uuid } from 'uuidv4';

import { db } from "../config/configDB";

import { IFlowider } from "../interfaces/iflowider.interface";

export const createPlace = (req: Request, res: Response, next: NextFunction) => {
    const { flowider_id,
            first_name,
            last_name,
            email } = req.user[0] as IFlowider;

    const createPlaceQuery = `
        INSERT INTO places ()
        VALUES ()
    `;
}

export const getAllPlace = (req: Request, res: Response, next: NextFunction) => {
    const { flowider_id,
            first_name,
            last_name,
            email } = req.user[0] as IFlowider;
    
    const getAllPlaceQuery = `
        SELECT *
        FROM places
        WHERE flowider_id = ${db.escape(flowider_id)}
    `;

    db.query(getAllPlaceQuery, (err, result) => {

    });
}

export const getPlaceById = (req: Request, res: Response, next: NextFunction) => {

}