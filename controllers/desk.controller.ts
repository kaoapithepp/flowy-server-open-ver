import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

// models
import Desk from "../models/Desk.model";
import ImagePool from "../models/ImagePool.model";

// utils
import { deleteImage, uploadImage } from "../utils/uploadImage";
import { imageList } from "../utils/imageList";
import { createTimeSlotForDeskSingle } from "../utils/timeslotUtils";

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
            const generateNewTimeSlot = await createTimeSlotForDeskSingle((createdDesk as any).desk_id);
            res.status(201).json({
                status: "Desk has been created successfully!",
                desk_info: createdDesk,
                // timeslot: generateNewTimeSlot
            })
        }

    } catch(err: any) {
        res.status(400).send("Creating desk failed!");
        throw new Error("Creating desk failed!");
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
        res.status(400).send("Upload desk's images failed!");
        throw new Error(err.message);
    }
}

export async function updateDeskImagesController(req: Request, res: Response, next: NextFunction){
    const desk_id = req.params.id;
    try {
        
        const image = await ImagePool.findAll({
            where: {               
                owner_id: desk_id,
                owner_type: "desk"
            }
        })

        if(image.length == 1){
            res.status(200).send({
                message: "The same image has been re-upload."
            });
        }

        // res.send(image);
        
        if(image.length == 0) {
            const imageURIs: string[] | any = await uploadImage(req, res, next);

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
        }

    } catch(err: any) {
        res.status(400).send("Update desk's images failed!");
        throw new Error(err.message);
    }
}

export async function deleteDeskImagesController(req: Request, res: Response, next: NextFunction){
    const desk_id = req.params.id;
    try {

        const images = await ImagePool.findAll({
            where: {               
                owner_id: desk_id,
                owner_type: "desk"
            }
        })

        await Promise.all(images.map(async (image: any, key) => {
            deleteImage(image.img_uri);
        }))

        await ImagePool.destroy({
            where: {
                owner_id: desk_id,
                owner_type: "desk"
            },
            force: true
        })

        res.status(201).send({
            message: "Deleted desk image successfully."
        });

    } catch(err: any) {
        res.status(400).send("Delete desk's images failed!");
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
            res.status(404).send("Desk not found!");
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
                desk_name: resultDesk.desk_name,
                description: resultDesk.description,
                isHotDesk: resultDesk.isHotDesk,
                min_seat: resultDesk.min_seat,
                max_seat: resultDesk.max_seat,
                place_id: resultDesk.place_id,
                image: imageList(resultDeskImages as [], "img_uri")
            });
        }

    } catch(err: any) {
        res.status(400).send("getDeskByIdController failed");
        throw new Error("getDeskByIdController failed");
    }
}

export async function editDeskByIdController(req: Request, res: Response) {
    const deskId = req.params.id;
    const data = req.body;
    try {
        const resultDesk: any = await Desk.findOne({
            where: { desk_id: deskId }
        });

        if(!resultDesk){
            res.status(404).send("Desk not found!");
        }

        if(resultDesk) {
            resultDesk.set({
                desk_name: data.desk_name,
                description: data.description,
                isHotDesk: data.isHotDesk,
                min_seat: data.min_seat,
                max_seat: data.max_seat,
            });

            resultDesk.save();

            res.status(201).json(resultDesk);
        }

    } catch(err: any) {
        res.status(400).send("updateDeskByIdController failed");
        throw new Error(err.message);
    }
}

export async function removeDeskByIdController(req: Request, res: Response) {
    try {
        const deskId = req.params.id;
        const result = await Desk.findOne({
            where: { desk_id: deskId }
        });
        
        if(result) {
            const images = await ImagePool.findAll({
                where: {
                    owner_id: deskId,
                    owner_type: "desk"
                }
            })

            Promise.all(images.map(async (image: any, key) => {
                deleteImage(image.img_uri);
            }))

            ImagePool.destroy({
                where: {
                    owner_id: deskId,
                    owner_type: "desk"
                },
                force: true
            })
            
            await Desk.destroy({
                where: { desk_id: deskId },
                force: true
            })

            res.status(201).json({
                message: "Desk has completely been deleted."
            })
        }
    } catch(err: any) {
        res.status(400).send("deleteDeskByIdController failed");
        throw new Error("deleteDeskByIdController failed");
    }
}

export async function getAllDesksByPlaceIdController(req: Request, res: Response) {
    const place_id = req.params.placeId;
    const customerAmount = req.query.ctm;

    try {
        const resultDesksByPlaceId = await Desk.findAll({
            where: { 
                place_id: place_id,
                max_seat: {
                    [Op.gte]: customerAmount
                } 
            }
        });

        if(resultDesksByPlaceId) {
            Promise.all(resultDesksByPlaceId.map(async (desk: any, key) => {
                const resultDeskImages = await ImagePool.findAll({
                    where: { 
                        owner_id: desk.desk_id,
                        owner_type: "desk"
                    }
                })

                return {
                    desk_id: desk.desk_id,
                    desk_name: desk.desk_name,
                    description: desk.description,
                    isHotDesk: desk.isHotDesk,
                    min_seat: desk.min_seat,
                    max_seat: desk.max_seat,
                    place_id: desk.place_id,
                    image: imageList(resultDeskImages as [], "img_uri")
                }
            }))
            .then(elem => {
                res.status(200).json(elem);
            })

        }

        
    } catch(err: any) {
        res.status(400).send("getAllDesksByPlaceIdController failed");
        throw new Error("getAllDesksByPlaceIdController failed");
    }
}

export async function getAllDesksNoAuthController(req: Request, res: Response) {
    try {
        const results = await Desk.findAll();

        res.status(200).json(results);
        
    } catch(err: any) {
        res.status(400).send("getAllDesksNoAuthController failed");
        throw new Error("getAllDesksNoAuthController failed");
    }
}