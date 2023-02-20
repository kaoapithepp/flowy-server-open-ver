import { Request } from "express";
import { Model } from "sequelize";

export interface IFlowider extends Model {
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

export interface IFlowiderAuth extends IFlowider {
    user?: any;
}

export type CombinedIFlowider = Request & IFlowiderAuth;