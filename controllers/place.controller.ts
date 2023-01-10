import { Request, Response, NextFunction } from "express";
import { uuid } from 'uuidv4';

import { db } from "../config/configDB";

import { IFlowider, IFlowiderAuthInfoRequest } from "../interfaces/iflowider.interface";

export const createPlace = (req: IFlowiderAuthInfoRequest, res: Response, next: NextFunction) => {
    const { flowider_id,
            first_name,
            last_name,
            email } = req.user[0] as IFlowider;

    const createPlaceQuery = `
        INSERT INTO places ()
        VALUES ()
    `;
}

export const getAllOwnPlace = (req: IFlowiderAuthInfoRequest, res: Response, next: NextFunction) => {
    const { flowider_id,
            first_name,
            last_name,
            email } = req.user[0];
    
    const getAllOwnPlaceQuery = `
        SELECT *
        FROM places
        WHERE flowider_id = ${db.escape(flowider_id)}
    `;

    db.query(getAllOwnPlaceQuery, (err, result) => {
        res.status(201).send(result);
    });
}

export const getPlaceById = (req: Request, res: Response, next: NextFunction) => {

}