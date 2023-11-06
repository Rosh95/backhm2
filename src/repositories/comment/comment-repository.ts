import {CommentModel, LikeStatusModel} from '../../db/dbMongo';
import {CommentsDBType, LikeStatusOption} from '../../types/comments-types';
import {ObjectId} from 'mongodb';
import {commentQueryRepository} from "./comment-query-repository";
import {LikeStatusDBType} from "../../types/likeStatus-types";


export const commentRepository = {
    async createCommentForPost(newComment: CommentsDBType): Promise<ObjectId> {
        const result = await CommentModel.create(newComment)
        return result._id
    },
    async getCommentById(commentId: string): Promise< CommentsDBType| null> {
        const comment = await CommentModel.findById(commentId);
        if (comment) {
            return comment;
        }
        return null
    },
    async deleteCommentById(commentId: string) {
        const result = await CommentModel.deleteOne({_id: new ObjectId(commentId)});
        console.log(result)
        return result.deletedCount === 1;
    },

    async updatedCommentById(commentId: string, commentContent: string) {
        const result = await CommentModel.findByIdAndUpdate(commentId,
            {
                $set: {
                    content: commentContent,
                }
            });
        return true;
        const newComment:LikeStatusDBType | null = await LikeStatusModel.findById({commentId});


    },
    async updatedCommentLikeStatusById(commentId: string, likeStatus: string) {
        const commentInfo = await commentQueryRepository.getCommentById(commentId);

        const result = await CommentModel.findByIdAndUpdate(commentId,
            {
                $set: {
                    "likesInfo.myStatus": likeStatus,
                }
            });
        return true;
    }


}