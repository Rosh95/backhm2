import {ObjectId} from 'mongodb';
import mongoose from "mongoose";

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentsViewModel = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo
    createdAt: string

}
export type CommentsInputType = {
    content: string
}
export type CommentsDBType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    postId: string,
    userLogin: string
    createdAt: Date
}
export type CommentsInputData = {
    content: string,
    userId: ObjectId,
    postId: string,
    userLogin: string
}


export type PaginatorCommentViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentsViewModel[]
}

export const CommentsSchema = new mongoose.Schema<CommentsDBType>({
    content: {type: String, require: true},
    userId: ObjectId,
    postId: {type: String, require: true},
    userLogin: {type: String, require: true, default: "Unknown user"},
    createdAt: {type: Date, default: Date.now()},
})