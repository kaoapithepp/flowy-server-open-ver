import { Request, Response } from "express";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function calculateOrderAmount(srcPrice: number) {
    return srcPrice*100;
}

export const paymentIntent = async (price: number) => {
    const paymentOrder = await stripe.paymentIntents.create({
        amount: await calculateOrderAmount(price),
        currency: "thb",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return paymentOrder;
}

export const makingStripePayment = async (totalAmt: number) => {
    try {
        const purchaseOrder = await paymentIntent(totalAmt);

        return {
            id: purchaseOrder.id,
            amount: purchaseOrder.amount,
            clientSecret: purchaseOrder.client_secret
        };

    } catch (err: any) {
        throw new Error(err.message);
    }
}

export const cancelingStripePayment = async (paymentIntentId: string) => {
    try {
        const cancelOrder = await stripe.paymentIntents.cancel(paymentIntentId);

        return cancelOrder.status;

    } catch (err: any) {
        throw new Error(err.message);
    }
}