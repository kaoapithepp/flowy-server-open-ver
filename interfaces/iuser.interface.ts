import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
    id: number;
    email: string;
    password: string;
    user_id: string;
    first_name: string;
    last_name: string;
    tel_no: string;
}