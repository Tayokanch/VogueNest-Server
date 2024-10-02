import mongoose, { Document } from 'mongoose';
import { OrderItemI, OrderSchemaI } from '../services.ts/interface';

const orderItemSchema = new mongoose.Schema<OrderItemI>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

});

const orderSchema = new mongoose.Schema<OrderSchemaI>({
  customerId: {
    type: String,
    required: true,
  },
  orders: {
    type: [orderItemSchema],
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['processing', 'packing', 'out for delivery', 'delivered'], // Valid values
    default: 'processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<OrderSchemaI>('Order', orderSchema);

export default Order;
