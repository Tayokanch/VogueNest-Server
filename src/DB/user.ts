import mongoose, { Schema } from "mongoose";
import { UserI } from "../services.ts/interface";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: true },

    role: {
      type: String,
      enum: ["user", "vogueadmin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});


UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id; // hide Mongo's _id
  },
});

export const User = mongoose.model<UserI>("User", UserSchema);
