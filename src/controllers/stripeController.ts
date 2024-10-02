import express from 'express';
import { Request, Response } from 'express';
import { ProductI } from '../services.ts/interface'; 

const stripe = require("stripe")(process.env.STRIPE_SECRET); 

export interface RequestInterface extends Request {
  body: {
    products: ProductI[]; 
  };
}

export const makePayment = async (req: RequestInterface, res: Response) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'No products provided.' });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "gbp", 
        product_data: {
          name: product.name, 
          images: product.image, 
        },
        unit_amount: Math.round(product.price * 100), 
      },
      quantity: product.quantity, 
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment", 
      success_url: "https://voguenestt.netlify.app/success",
      cancel_url: "https://voguenestt.netlify.app/cancel"
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};