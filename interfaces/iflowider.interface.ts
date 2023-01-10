import { Request, RequestHandler } from "express";
import { RowDataPacket } from "mysql2";

export interface IFlowider extends RowDataPacket {
    id?: number;
    flowider_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    bnk_acc: string;
    bnk_name: string;
    tel_no: string;
    createAt: string;
    img_url: string;
};

export interface IFlowiderAuthInfoRequest extends Request, IFlowider {
    user?: any;
}