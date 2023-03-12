import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

// models
import Booking from "../models/Booking.model";
import Timeslot from "../models/Timeslot.model";
import Place from "../models/Place.model";

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
        const changeSelectedTimeSlotsStatus = await Promise.all(
            selectedTimeSlots.map(async (timeslot: any) => {
                const foundTimeSlot: any = await Timeslot.findOne({
                    where: {
                        timeslot_id: timeslot.timeslot_id
                    }
                })

                foundTimeSlot.status = "pending";
                foundTimeSlot.occupied_seat = total_bk_seat;

                await foundTimeSlot.save();

                return foundTimeSlot;
            })
        )

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
        })

        const createdPurchaseOrder = await makingStripePayment(bookingOrder.total_bk_price)
        
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
        throw new Error("Init purchasement failed!");
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