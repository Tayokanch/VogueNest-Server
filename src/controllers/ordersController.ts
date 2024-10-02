import express from 'express';
import Order from '../DB/order';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrderItemI } from '../services.ts/interface';


export const postOrder = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const customerId = req.decodedUser?.id;
    if (!customerId) {
      throw new Error('CustomerId not found');
      return;
    }
    const { orders }: { orders: OrderItemI[] } = req.body;
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Order items are required' });
    }

    for (const item of orders) {
      const { productId, size, quantity } = item;
      if (!productId || !size || !quantity) {
        return res.status(404).json({
          message: 'Each order item must inlcude productId, size, quantity',
        });
      }
    }
    const newOrder = await new Order({
      customerId: customerId,
      orders: orders.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      })),
    });

    await newOrder.save();
    return res.status(201).json({ message: 'Order processed' });
  } catch (err) {
    console.error("THis is the err", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserOrder = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const customerId = req.decodedUser?.id;

    if (!customerId) {
      return res.status(400).json({ message: 'customerId not found' });
    }

    const order = await Order.find({ customerId });

    if (!order || order.length === 0) {
      return res
        .status(404)
        .json({ message: 'No orders found for you' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internsl Server error'});
  }
};
