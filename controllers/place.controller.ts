import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/configDB";

// models
import Place from "../models/Place.model";
import Amenity from "../models/Amenity.model";
import Specification from "../models/Specification.model";
import ImagePool from "../models/ImagePool.model";

// utils
import { deleteImage, uploadImage } from "../utils/uploadImage";
import { imageList } from "../utils/imageList";
import Desk from "../models/Desk.model";

export async function createPlaceController(req: Request, res: Response) {
    try {
        const createdPlace = await Place.create({
            place_name: req.body.place_name,
            // lat_geo: req.body.lat_geo,
            // long_geo: req.body.long_geo,
            description: req.body.description,
            place_category: req.body.place_category,
            unit_price: req.body.unit_price,
            open_hr: req.body.open_hr,
            close_hr: req.body.close_hr,
            flowider_id: (req as any).user.flowider_id
        });
        
        const createAmenity = await Amenity.create({
            place_id: (createdPlace as any).place_id,
            // hasPowerSupply: req.body.hasPowerSupply,
            // hasWifi: req.body.hasWifi,
            // hasRestroom: req.body.hasRestroom,
            // hasProjector: req.body.hasProjector,
            // hasHDMI: req.body.hasHDMI,
            // hasFlowiderCare: req.body.hasFlowiderCare,
            // hasAirCondition: req.body.hasAirCondition,
            // hasNapZone: req.body.hasNapZone,
            // hasSnackAndBeverage: req.body.hasSnackAndBeverage,
            // hasCCTVorSecurity: req.body.hasCCTVorSecurity
        });

        const createSpec = await Specification.create({
            place_id: (createdPlace as any).place_id,
            // good_for: req.body.good_for,
            // most_suit_for: req.body.most_suit_for,
            // isQuiet: req.body.isQuiet,
            // isLoudable: req.body.isLoudable,
            // isAtmospheric: req.body.isAtmospheric,
            // isSmokable: req.body.isSmokable 
        });

        const [results] = await sequelize.query(
            `
            SELECT *
            FROM Place
            JOIN Amenity ON Place.place_id = Amenity.place_id
            JOIN Specification ON Place.place_id = Specification.place_id
            WHERE Place.place_id = ?
            `, {
                replacements: [(createdPlace as any).place_id]
            }
        );

        if(createdPlace && createAmenity && createSpec) {
            res.status(201).json({
                status: "Place has been created successfully!",
                info: results[0]
            });
        }

    } catch(err: any) {
        res.status(400).send("Creating place failed!");
        throw new Error(err.message);
    }
}

export async function uploadPlaceImagesController(req: Request, res: Response, next: NextFunction){
    try {
        const place_id = req.params.id;
        const imageURIs: string[] | any = await uploadImage(req, res, next);
        
        if(!imageURIs){
            res.status(401).json("Something went wrong.");
        }

        const placeImageIntoPool = await Promise.all(
            imageURIs.map((file: any) => {
                const insertImagePool = ImagePool.create({
                    img_uri: file,
                    owner_id: place_id,
                    owner_type: "place"
                });

                return insertImagePool;
            })
        )

        if(placeImageIntoPool){
            res.status(201).json({
                message: "Your attachment has been upload successfully.",
            });
        }

    } catch(err: any) {
        res.status(400).send("Uploading place's images failed!");
        throw new Error("Uploading place's images failed!");
    }
}

export async function getAllBelongPlaceController(req: Request, res: Response) {
    try {
        const allBelongPlace = await Place.findAll({
            where: { flowider_id: (req as any).user.flowider_id}
        });

        if(!allBelongPlace) {
            res.status(404).send("Not found!");
        }
        
      
        Promise.all(allBelongPlace.map(async (place: any, key, arr) => {
            const resultPlaceImages = await ImagePool.findAll({
                where: { 
                    owner_id: place.place_id,
                    owner_type: "place"
                }
            })

            return {
                place_id: place.place_id,
                place_name: place.place_name,
                lat_geo: place.lat_geo,
                long_geo: place.long_geo,
                description: place.description,
                place_category: place.place_category,
                unit_price: place.unit_price,
                open_hr: place.open_hr,
                close_hr: place.close_hr,
                work_hr: Number(place.close_hr.substr(0,2)) - Number(place.open_hr.substr(0,2)),
                image: imageList(resultPlaceImages as [], "img_uri")
            }
        })).then(elem => {
            res.status(200).send(elem);
        });

    } catch(err: any) {
        res.status(400).send("Get all belong place failed!");
        throw new Error("Get all belong place failed!");
    }
}

export async function getPlaceByIdController(req: Request, res: Response) {
    try {
        const placeId = req.params.id;
        const resultPlace: any = await Place.findOne({
            where: { place_id: placeId }
        });

        if(!resultPlace){
            res.status(404).send("Place not found!");
        }

        if(resultPlace) {
            const resultSpecs = await Specification.findOne({
                attributes: ['isQuiet', 'isSmokable', 'isAtmospheric', 'isLoudable'],
                where: { place_id: resultPlace.place_id }
            });

            const resultAmenities = await Amenity.findOne({
                where: { place_id: resultPlace.place_id }
            });
            
            const resultPlaceImages = await ImagePool.findAll({
                where: { 
                    owner_id: placeId,
                    owner_type: "place"
                }
            })

            const [resultDesks] = await sequelize.query(`
                SELECT Desk.desk_id, Desk.desk_name, ImagePool.img_uri
                FROM Desk
                JOIN ImagePool ON Desk.desk_id = ImagePool.owner_id
                WHERE Desk.place_id = ?
            `, {
                replacements: [placeId]
            });

            res.status(201).json({
                place_id: resultPlace.place_id,
                place_name: resultPlace.place_name,
                lat_geo: resultPlace.lat_geo,
                long_geo: resultPlace.long_geo,
                description: resultPlace.description,
                place_category: resultPlace.place_category,
                unit_price: resultPlace.unit_price,
                open_hr: resultPlace.open_hr,
                close_hr: resultPlace.close_hr,
                work_hr: Number(resultPlace.close_hr.substr(0,2)) - Number(resultPlace.open_hr.substr(0,2)),
                spec: resultSpecs,
                amenity: resultAmenities,
                desk: resultDesks,
                image: imageList(resultPlaceImages as [], "img_uri")
            });
        }
        
    } catch(err: any) {
        res.status(400).send("Get place by id failed!");
        throw new Error("Get place by id failed!");
    }
}

export async function updatePlaceByIdController(req: Request, res: Response) {
    const placeId = req.params.id;
    const data = req.body;

    try {
        const foundPlace = await Place.findOne({
            where: { place_id: placeId }
        });

        if(!foundPlace) res.status(404).send("Place not found!");

        if(foundPlace) {
            foundPlace.set(data);

            foundPlace.save();

            res.status(201).json(foundPlace);
        }
        
    } catch(err: any) {
        res.status(400).send("Update place failed!");
        throw new Error(err.message);
    }
}

export async function deletePlaceByIdController(req: Request, res: Response) {
    try {
        const placeId = req.params.id;
        const result = await Place.findOne({
            where: { place_id: placeId }
        });

        if(result) {
            const images = await ImagePool.findAll({
                where: {
                    owner_id: placeId,
                    owner_type: "place"
                }
            })

            Promise.all(images.map(async (image: any, key) => {
                deleteImage(image.img_uri);
            }))

            await ImagePool.destroy({
                where: {
                    owner_id: placeId,
                    owner_type: "place"
                },
                force: true
            })

            await Place.destroy({
                where: { place_id: placeId },
                force: true
            })

            res.status(201).json({
                message: "Place has completely been deleted."
            })
        }
        
    } catch(err: any) {
        res.status(400).send("Delete place failed!");
        throw new Error("Delete place failed!");
    }
}

export async function getAllPlacesNoAuthController(req: Request, res: Response) {
    try {
        const queryResult = await Place.findAll();

        if(queryResult) {
            Promise.all(queryResult.map(async (place: any, key, arr) => {
                const resultSpecs = await Specification.findOne({
                    attributes: ['isQuiet', 'isSmokable'],
                    where: { place_id: place.place_id }
                });
                
                const resultPlaceImages = await ImagePool.findAll({
                    where: { 
                        owner_id: place.place_id,
                        owner_type: "place"
                    }
                });
    
                return {
                    place_id: place.place_id,
                    place_name: place.place_name,
                    lat_geo: place.lat_geo,
                    long_geo: place.long_geo,
                    description: place.description,
                    place_category: place.place_category,
                    unit_price: place.unit_price,
                    open_hr: place.open_hr,
                    close_hr: place.close_hr,
                    work_hr: Number(place.close_hr.substr(0,2)) - Number(place.open_hr.substr(0,2)),
                    spec: resultSpecs,
                    image: imageList(resultPlaceImages as [], "img_uri")
                }
            })).then(elem => {
                res.status(200).send(elem);
            });
        }
        
    } catch(err: any) {
        res.status(400).send(err.message);
    }
};

export async function getSpecsByIdController(req: Request, res: Response) {
    const placeId = req.params.id;
    const data = req.body;

    try {
        const foundSpec = await Specification.findOne({
            where: { place_id: placeId }
        });

        if(!foundSpec) res.status(404).send("Specification not found!");

        if(foundSpec) {
            res.status(201).json(foundSpec);
        }
        
    } catch(err: any) {
        res.status(400).send("Update place failed!");
        throw new Error(err.message);
    }
}

export async function updateSpecsByIdController(req: Request, res: Response) {
    const placeId = req.params.id;
    const data = req.body;

    try {
        const foundSpec = await Specification.findOne({
            where: { place_id: placeId }
        });

        if(!foundSpec) res.status(404).send("Specification not found!");

        if(foundSpec) {
            foundSpec.set(data);

            foundSpec.save();

            res.status(201).json(foundSpec);
        }
        
    } catch(err: any) {
        res.status(400).send("Update place failed!");
        throw new Error(err.message);
    }
}

export async function getAmenitiesByIdController(req: Request, res: Response) {
    const placeId = req.params.id;
    const data = req.body;

    try {
        const foundAmenity = await Amenity.findOne({
            where: { place_id: placeId }
        });

        if(!foundAmenity) res.status(404).send("Amenity not found!");

        if(foundAmenity) {
            res.status(201).json(foundAmenity);
        }
        
    } catch(err: any) {
        res.status(400).send("Update place failed!");
        throw new Error(err.message);
    }
}

export async function updateAmenitiesByIdController(req: Request, res: Response) {
    const placeId = req.params.id;
    const data = req.body;

    try {
        const foundAmenity = await Amenity.findOne({
            where: { place_id: placeId }
        });

        if(!foundAmenity) res.status(404).send("Amenity not found!");

        if(foundAmenity) {
            foundAmenity.set(data);

            foundAmenity.save();

            res.status(201).json(foundAmenity);
        }
        
    } catch(err: any) {
        res.status(400).send("Update place failed!");
        throw new Error(err.message);
    }
}