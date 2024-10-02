import mongoose from 'mongoose';
export interface UserI {
  name: string;
  email: string;
  role: string
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemI {
  productId: mongoose.Types.ObjectId;
  size: string;
  quantity: number;
}
export interface OrderSchemaI extends Document {
  customerId: string;
  orders: OrderItemI[];
  deliveryStatus: 'processing' | 'packing' | 'out for delivery' | 'delivered';
  createdAt: Date;
}
export interface ProductI {
  name: string;
  image: string[];  
  size: string;
  currency: string;  
  quantity: number;  
  price: number;    
  productId: string; 
}

export interface DecodedUserI {
  id: string;
  name: string;
  role: string
}