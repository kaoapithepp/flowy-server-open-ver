import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/configDB";

// interfaces
import { CustomRequest } from "../interfaces/iauth.interface";

export async function getAllScheduleByPlaceIdController(req: Request, res: Response){
    const { flowider_id } = (req as CustomRequest).user;
    const place_id = req.params.placeId;

    try {
        const [results]: any = await sequelize.query(`
            SELECT User.first_name,
                User.last_name,
                Place.place_name,
                Place.place_id,
                Desk.desk_id,
                Desk.desk_name,
                Timeslot.timeslot_id,
                Timeslot.start_time,
                Timeslot.end_time,
                Timeslot.orderNo,
                Booking.booking_id,
                Booking.status,
                Booking.total_bk_hr,
                Booking.total_bk_price,
                Booking.total_bk_seat,
                Booking.createdAt
            FROM flowy_db_dev_test.Booking as Booking
            JOIN (
                SELECT Place.place_id, Place.place_name, Place.flowider_id
                FROM flowy_db_dev_test.Place as Place
            ) as Place ON Booking.place_id = Place.place_id
            JOIN (
                SELECT Flowider.flowider_id
                FROM flowy_db_dev_test.Flowider as Flowider
            ) as Flowider ON Place.flowider_id = Flowider.flowider_id
            JOIN (
                SELECT Desk.desk_name, Desk.desk_id
                FROM flowy_db_dev_test.Desk
            ) as Desk ON Booking.desk_id = Desk.desk_id
            JOIN (
                SELECT User.first_name, User.last_name, User.user_id
                FROM flowy_db_dev_test.User as User
            ) as User ON Booking.user_id = User.user_id
            JOIN (
                SELECT Timeslot.timeslot_id, Timeslot.start_time, Timeslot.end_time, Timeslot.orderNo, Timeslot.occupied_seat, Timeslot.status, Timeslot.booking_id
                FROM flowy_db_dev_test.Timeslot as Timeslot
            ) as Timeslot ON Booking.booking_id = Timeslot.booking_id
            WHERE Flowider.flowider_id = ?
                AND Place.place_id = ?
                AND SUBSTRING(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+07:00'), 1, 10)
                    = SUBSTRING(CONVERT_TZ(\`createdAt\`, '+00:00', '+07:00'), 1, 10)
                AND CAST(\`start_time\` as DECIMAL) > SUBSTRING(CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+07:00'), 12, 2)
            GROUP BY Booking.booking_id
            ORDER BY orderNo ASC;
        `, {
            replacements: [flowider_id, place_id]
        })

        if(!results) res.status(404).send("Something went wrong with Schedule!");

        res.status(200).send(results);

    } catch(err: any) {
        res.status(400).send(err.message);
    }
} 