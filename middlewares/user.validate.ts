import { Request, Response, NextFunction } from 'express';

export const userValidate = (req: Request, res: Response, next: NextFunction ) => {

    const { email } = req.body;

    // no username provided, username length must longer than 
    if(!email){
        return res.status(400).send({
            message: "Please provide an email."
        });
    }

    next();   
}