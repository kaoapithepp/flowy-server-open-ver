import { Request, Response, NextFunction } from "express";

// models
import Desk from "../models/Desk.model";
import ImagePool from "../models/ImagePool.model";

// utils
import { uploadImage } from "../utils/uploadImage";
import { imageList } from "../utils/imageList";

export async function createDeskController(req: Request, res: Response) {
    try {
        const { desk_name,
            description,
            isHotDesk,
            min_seat,
            max_seat } = req.body;

        const placeId = req.params.place_id;

        const createdDesk = await Desk.create({
            desk_name: desk_name,
            description: description,
            isHotDesk: isHotDesk,
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

export async function uploadDeskImagesController(req: Request, res: Response, next: NextFunction){
    try {
        const desk_id = req.params.id;
        const imageURIs: string[] | any = await uploadImage(req, res, next);
        
        if(!imageURIs){
            res.status(401).json("Something went wrong.");
        }

        const deskImageIntoPool = await Promise.all(
            imageURIs.map((file: any) => {
                const insertImagePool = ImagePool.create({
                    img_uri: file,
                    owner_id: desk_id,
                    owner_type: "desk"
                });

                return insertImagePool;
            })
        )

        if(deskImageIntoPool){
            res.status(201).json({
                message: "Your attachment has been upload successfully.",
            });
        }

    } catch(err: any) {
        throw new Error(err.message);
    }
}

export async function getDeskByIdController(req: Request, res: Response) {
    try {
        const deskId = req.params.id;
        const resultDesk: any = await Desk.findOne({
            where: { desk_id: deskId }
        });

        if(!resultDesk){
            throw new Error("Place not found!");
        }

        if(resultDesk) {
            const resultDeskImages = await ImagePool.findAll({
                where: { 
                    owner_id: deskId,
                    owner_type: "desk"
                }
            })
            res.status(201).json({
                desk_id: resultDesk.desk_id,
                desk_name: resultDesk.place_name,
                description: resultDesk.description,
                isHotDesk: resultDesk.isHotDesk,
                min_seat: resultDesk.min_seat,
                max_seat: resultDesk.max_seat,
                image: imageList(resultDeskImages as [], "img_uri")
            });
        }

    } catch(err: any) {
        throw new Error(err.message);
    }
}

export async function deleteDeskByIdController(req: Request, res: Response) {
    try {
        const deskId = req.params.id;
        const result = await Desk.destroy({
            where: { desk_id: deskId },
            force: true
        });

        if(result) {
            res.status(201).json({
                message: "Desk has been deleted completely."
            })
        }
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