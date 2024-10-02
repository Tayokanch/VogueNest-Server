import mongoose, { Schema } from 'mongoose';
import { UserI } from '../services.ts/interface';

const UserSchema: Schema<UserI> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true },
    role: { 
      type: String,
      enum: ['user', 'vogueadmin'],
      default: 'user',

    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
      },
    },
  }
);


export const User = mongoose.model<UserI>("User", UserSchema)