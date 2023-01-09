import { Request, Response, NextFunction } from 'express';

export const emailValidate = (req: Request, res: Response, next: NextFunction ) => {

    const { email } = req.body;

    // no username provided
    if(!email){
        return res.status(400).send({
            message: "Please provide an email."
        });
    }

    next();   
}