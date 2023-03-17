import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

// models
import Booking from "../models/Booking.model";
import Timeslot from "../models/Timeslot.model";
import Place from "../models/Place.model";
import User from "../models/User.model";

// interfaces
import { IUser } from "../interfaces/iuser.interface";
import { CustomRequest } from "../interfaces/iauth.interface";

// utils
import { priceCalculation } from "../utils/priceCalculation";
import { cancelingStripePayment, makingStripePayment } from "../utils/stripePayment";
import { sequelize } from "../config/configDB";

export async function createBookingOrderController(req: Request, res: Response){
    const { user_id } = (req as any).user;
    const {
        place_id,
        desk_id,
        total_bk_seat,
        selectedTimeSlots
    } = req.body;

    try {
        const searchedUnitPrice = await Place.findOne({
            where: {
                place_id: place_id
            },
            attributes: ['unit_price']
        });

        const createdBooking: any = await Booking.create({
            user_id: user_id,
            place_id: place_id,
            desk_id: desk_id,
            total_bk_hr: selectedTimeSlots.length,
            total_bk_seat: total_bk_seat,
            total_bk_price: await priceCalculation((searchedUnitPrice as any).unit_price, total_bk_seat, selectedTimeSlots.length)
        });

        const changeSelectedTimeSlotsStatus = await Promise.all(
            selectedTimeSlots.map(async (timeslot: any) => {
                const foundTimeSlot: any = await Timeslot.findOne({
                    where: {
                        timeslot_id: timeslot.timeslot_id
                    }
                })

                foundTimeSlot.status = "pending";
                foundTimeSlot.booking_id = createdBooking.booking_id;
                foundTimeSlot.occupied_seat = total_bk_seat;

                await foundTimeSlot.save();

                return foundTimeSlot;
            })
        );

        res.status(201).send(createdBooking);

    } catch(err: any) {
        res.send(err.message);
        throw new Error(err.message);
    }
}

export async function initPayByBookingIdController(req: Request, res: Response) {
    const { user_id } = (req as CustomRequest).user;
    const booking_id = req.params.id;

    try {
        const bookingOrder: any = await Booking.findOne({
            where: {
                booking_id: booking_id,
                user_id: user_id
            }
        });

        const findUnitPrice: any = await Place.findOne({
            where: {
                place_id: (bookingOrder as any).place_id
            },
            attributes: ['unit_price']
        });

        const findUserEmail: any = await User.findOne({
            where: {
                user_id: user_id
            },
            attributes: ['email']
        });

        const createdPurchaseOrder = await makingStripePayment(bookingOrder.total_bk_price, findUserEmail.email)
        
        if(!bookingOrder){
            res.status(404).send("Looking booking order not found!");
            throw new Error("Looking booking order not found!");
        }
        
        if(bookingOrder){
            res.status(200).send({
                booking_order :{ 
                    booking_id: bookingOrder.booking_id,
                    place_id: bookingOrder.place_id,
                    total_bk_hr: bookingOrder.total_bk_hr,
                    total_bk_seat: bookingOrder.total_bk_seat,
                    total_bk_price: bookingOrder.total_bk_price,
                    status: bookingOrder.status,
                    unit_price: findUnitPrice.unit_price
                },
                purchase_order: createdPurchaseOrder
            });
        }
        
    } catch (err: any) {
        res.status(400).send("Init purchasement failed!");
        throw new Error(err.message);
    }
}

export async function cancelPayByBookingIdController(req: Request, res: Response) {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    try {
        const canceledStripeStatus = await cancelingStripePayment(paymentIntentId);

        if(canceledStripeStatus == "canceled") {
            const foundBookingOrder: any = await Booking.findOne({
                where: {
                    booking_id: id
                }
            })

            foundBookingOrder.status = "canceled";

            await foundBookingOrder.save();

            const [foundTimeSlots, metadata] = await sequelize.query(`
                SELECT timeslot_id
                FROM Timeslot
                JOIN Booking
                    ON Booking.desk_id = Timeslot.desk_id
                WHERE Booking.booking_id = ?
                    AND Timeslot.status = "pending"
            `, {
                replacements: [id]
            })

            await Promise.all(foundTimeSlots.map(async (timeslot: any, key: any) => {
                const foundTimeslot: any = await Timeslot.findOne({
                    where: {
                        timeslot_id: timeslot.timeslot_id
                    }
                })

                foundTimeslot.status = "vacant";

                await foundTimeslot.save()
            }))

            res.status(201).send({
                status: "OK",
                message: "Canceling successful."
            });

        } else {
            res.status(403).send("Canceling went wrong.");
        }

    } catch(err: any) {
        res.status(400).send(err.message);
    }
}

export async function completedPayByBookingIdController(req: Request, res: Response) {
    const { id } = req.params;

    try {
            const foundBookingOrder: any = await Booking.findOne({
                where: {
                    booking_id: id
                }
            })

            foundBookingOrder.status = "completed";

            await foundBookingOrder.save();

            const [foundTimeSlots, metadata] = await sequelize.query(`
                SELECT timeslot_id
                FROM Timeslot
                JOIN Booking
                    ON Booking.desk_id = Timeslot.desk_id
                WHERE Booking.booking_id = ?
                    AND Timeslot.status = "pending"
            `, {
                replacements: [id]
            })

            await Promise.all(foundTimeSlots.map(async (timeslot: any, key: any) => {
                const foundTimeslot: any = await Timeslot.findOne({
                    where: {
                        timeslot_id: timeslot.timeslot_id
                    }
                })

                foundTimeslot.status = "occupied";

                await foundTimeslot.save()
            }))

            res.status(201).send({
                status: "OK",
                message: "Booking completion successful."
            });

    } catch(err: any) {
        res.status(400).send(err.message);
    }
}

export async function retreiveBookingDetailAfterCompletedByIdController(req: Request, res: Response){
    const { user_id } = (req as CustomRequest).user;
    const booking_id = req.params.id;

    try {
        const foundBookingOrder: any = await Booking.findOne({
            where: {
                booking_id: booking_id
            }
        })

        foundBookingOrder.status = "completed";

        await foundBookingOrder.save();

        const [foundTimeSlots, metadata] = await sequelize.query(`
            SELECT timeslot_id
            FROM Timeslot
            JOIN Booking
                ON Booking.desk_id = Timeslot.desk_id
            WHERE Booking.booking_id = ?
                AND Timeslot.status = "pending"
        `, {
            replacements: [booking_id]
        })

        await Promise.all(foundTimeSlots.map(async (timeslot: any, key: any) => {
            const foundTimeslot: any = await Timeslot.findOne({
                where: {
                    timeslot_id: timeslot.timeslot_id
                }
            })

            foundTimeslot.status = "occupied";

            await foundTimeslot.save()
        }))

        const [bookingJoinWithPlace]: any = await sequelize.query(`
            SELECT *
            FROM Booking
            JOIN (SELECT place_name, place_id, description FROM Place) AS Place ON Booking.place_id = Place.place_id
            JOIN (SELECT desk_name, desk_id FROM Desk) AS Desk ON Booking.desk_id = Desk.desk_id
            WHERE Booking.user_id = ?
                AND Booking.booking_id = ?
        `, {
            replacements: [user_id, booking_id]
        })

        if(!bookingJoinWithPlace) res.status(404).send("Booking order not found!");

        res.status(200).send(bookingJoinWithPlace);

    } catch(err: any) {
        res.status(400).send(err.message);
    }
}

export async function getBookingDetailByUserIdController(req: Request, res: Response){
    const { user_id } = (req as CustomRequest).user;

    try {
        const [bookingJoinWithPlace]: any = await sequelize.query(`
            SELECT *
            FROM Booking
            JOIN (SELECT place_name, place_id, description FROM Place) AS Place ON Booking.place_id = Place.place_id
            JOIN (SELECT desk_name, desk_id FROM Desk) AS Desk ON Booking.desk_id = Desk.desk_id
            WHERE Booking.user_id = ?
            ORDER BY createdAt DESC
        `, {
            replacements: [user_id]
        })

        if(!bookingJoinWithPlace) res.status(404).send("Booking order not found!");

        res.status(200).send(bookingJoinWithPlace);

    } catch(err: any) {
        res.status(400).send(err.message);
    }
} 

export async function getEachBookingDetailByIdController(req: Request, res: Response){
    const { user_id } = (req as CustomRequest).user;
    const booking_id = req.params.id;

    try {
        const [bookingJoinWithPlace]: any = await sequelize.query(`
            SELECT *
            FROM Booking
            JOIN (SELECT place_name, place_id, description, lat_geo, long_geo FROM Place) AS Place ON Booking.place_id = Place.place_id
            JOIN (SELECT desk_name, desk_id FROM Desk) AS Desk ON Booking.desk_id = Desk.desk_id
            WHERE Booking.user_id = ?
                AND Booking.booking_id = ?
            ORDER BY createdAt DESC
        `, {
            replacements: [user_id, booking_id]
        })

        if(!bookingJoinWithPlace) res.status(404).send("Booking order not found!");

        res.status(200).send(bookingJoinWithPlace);

    } catch(err: any) {
        res.status(400).send(err.message);
    }
} 