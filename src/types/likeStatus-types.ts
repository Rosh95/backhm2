import {LikeStatusOption} from "./comments-types";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";


export type LikeStatusDBType = {
    entityId: String,
    userId: String,
    userLogin: string,
    likeStatus: LikeStatusOption,
    createdAt: Date
}


export const LikeStatusSchema = new mongoose.Schema<LikeStatusDBType>({
    entityId: {type: String, require: true},
    userId: {type: String, require: true},
    userLogin: {type: String, require: true},
    likeStatus: {type: String, enum: LikeStatusOption, require: true, default: LikeStatusOption.None},
    createdAt: {type: Date, default: Date.now()}

})