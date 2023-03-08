import { Request, Response } from "express";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

function calculateOrderAmount(items: number) {
    return 60*items;
}

export const paymentIntent = async (items: number) => {
    const clientSecret = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "thb",
        automatic_payment_methods: {
        enabled: true,
        },
    });

    return clientSecret;
}

export const makingStripePayment = async (req: Request, res: Response) => {
    try {
        const { items } = req.body;
        const clientSecret = await paymentIntent(items);

        res.send({
            clientSecret: clientSecret.client_secret
        });
    } catch (err: any) {
        throw new Error(err.message);
    }
}