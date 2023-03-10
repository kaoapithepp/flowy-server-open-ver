import { Request, Response } from "express";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function calculateOrderAmount(items: number) {
    return 60*items;
}

export const paymentIntent = async (items: number) => {
    const clientSecret = await stripe.paymentIntents.create({
        amount: 199999,
        currency: "thb",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return clientSecret;
}

export const makingStripePayment = async (req: Request, res: Response) => {
    try {
        // const { items } = req.body;
        const clientSecret = await paymentIntent(1);

        res.send({
            amount: clientSecret.amount,
            clientSecret: clientSecret.client_secret
        });

    } catch (err: any) {
        res.status(err.status).send(err.message);
    }
}