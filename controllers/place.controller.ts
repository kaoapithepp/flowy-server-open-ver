import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/configDB";

// models
import Place from "../models/Place.model";
import Amenity from "../models/Amenity.model";
import Specification from "../models/Specification.model";

export async function createPlaceController(req: Request, res: Response) {
    try {
        const createdPlace = await Place.create({
            place_name: req.body.place_name,
            lat_geo: req.body.lat_geo,
            long_geo: req.body.long_geo,
            description: req.body.description,
            place_category: req.body.place_category,
            unit_price: req.body.unit_price,
            open_hr: req.body.open_hr,
            close_hr: req.body.close_hr,
            flowider_id: (req as any).user.flowider_id
        });
        
        const createAmenity = await Amenity.create({
            place_id: (createdPlace as any).place_id,
            hasPowerSupply: req.body.hasPowerSupply,
            hasWifi: req.body.hasWifi,
            hasRestroom: req.body.hasRestroom,
            hasProjector: req.body.hasProjector,
            hasHDMI: req.body.hasHDMI,
            hasFlowiderCare: req.body.hasFlowiderCare,
            hasAirCondition: req.body.hasAirCondition,
            hasNapZone: req.body.hasNapZone,
            hasSnackAndBeverage: req.body.hasSnackAndBeverage,
            hasCCTVorSecurity: req.body.hasCCTVorSecurity
        });

        const createSpec = await Specification.create({
            place_id: (createdPlace as any).place_id,
            good_for: req.body.good_for,
            most_suit_for: req.body.most_suit_for,
            isQuiet: req.body.isQuiet,
            isLoudable: req.body.isLoudable,
            isAtmospheric: req.body.isAtmospheric,
            isSmokable: req.body.isSmokable 
        });

        const [results, metadata] = await sequelize.query(
            `
            SELECT *
            FROM Place
            JOIN Amenity ON Place.place_id = Amenity.place_id
            JOIN Specification ON Place.place_id = Specification.place_id
            `
        );

        if(!createdPlace){
            res.status(400).send("Creating place is unsuccessful!");
        }

        if(!createAmenity){
            res.status(400).send("Input amenities are unsuccessful!");
        }

        if(!createSpec){
            res.status(400).send("Input specs are unsuccessful!");
        }

        if(createdPlace && createAmenity && createSpec) {
            res.status(201).json({
                status: "Place has been created successfully!",
                info: results[0]
            });
        }

    } catch(err: any) {
        throw new Error(err);
    }
}

export async function getAllBelongPlaceController(req: Request, res: Response) {
    try {
        const allBelongPlace = await Place.findAll({
            where: { flowider_id: (req as any).user.flowider_id}
        });

        if(!allBelongPlace) {
            throw new Error("Not found!");
        }
        
        if(allBelongPlace) {
            res.status(201).json(allBelongPlace);
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
}

export async function getPlaceByIdController(req: Request, res: Response) {
    try {
        const placeId = req.params.id;
        const result = await Place.findOne({
            where: { place_id: placeId }
        });

        if(!result){
            throw new Error("Place not found!");
        }

        if(result) {
            res.status(201).json(result)
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
}

export async function deletePlaceByIdController(req: Request, res: Response) {
    try {
        const placeId = req.params.id;
        const result = await Place.destroy({
            where: { place_id: placeId }
        });

        if(!result){
            throw new Error("Can't delete, Place not found!");
        }

        if(result) {
            res.status(201).json({
                message: "Place has completely been deleted."
            })
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
}

export async function getAllPlacesNoAuthController(req: Request, res: Response) {
    try {
        const result = await Place.findAll();

        if(result) {
            res.status(201).json(result);
        }
        
    } catch(err: any) {
        throw new Error(err);
    }
};