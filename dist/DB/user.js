"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true },
    role: {
        type: String,
        enum: ["user", "vogueadmin"],
        default: "user",
    },
}, {
    timestamps: true,
    versionKey: false,
});
//  Create a clean string `id`
UserSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
//  Configure clean JSON output
UserSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id; // hide Mongo's _id
    },
});
exports.User = mongoose_1.default.model("User", UserSchema);
