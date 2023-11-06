import {ObjectId} from 'mongodb';
import {CommentsDBType, CommentsInputData, LikeStatusOption} from '../types/comments-types';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {commentRepository} from '../repositories/comment/comment-repository';
import {LikeStatusModel} from "../db/dbMongo";
import {NewUsersDBType} from "../types/user-types";
import {LikeStatusDBType} from "../types/likeStatus-types";


export const commentsService = {
    async sendComment(comment: string, id: ObjectId | string) {
        return null;
    },
    async allFeedback(comment: string, userId: ObjectId) {
        return commentQueryRepository.getAllComments();
    },

    async getCommentById(commentId: string) {
        return commentRepository.getCommentById(commentId);
    },

    async deleteCommentById(commentId: string) {
        return await commentRepository.deleteCommentById(commentId);
    },

    async createCommentForPost(newCommentData: CommentsInputData): Promise<ObjectId> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            content: newCommentData.content,
            commentatorInfo: {
                userId: newCommentData.userId,
                userLogin: newCommentData.userLogin,
            },
            postId: newCommentData.postId,
            createdAt: new Date(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatusOption.None
            }
        }
        return commentRepository.createCommentForPost(newComment)
    },

    async updateCommentById(commentId: string, commentContent: string) {
        return commentRepository.updatedCommentById(commentId, commentContent)
    },
    async updateCommentLikeStatusById(commentInfo: CommentsDBType, newLikeStatusForComment: LikeStatusOption, currentUser: NewUsersDBType) {
      //  const currentLikeStatus = commentInfo.likesInfo.myStatus;
        const findLikeStatusInDB: LikeStatusDBType | null = await LikeStatusModel.findOne({
            entityId: commentInfo._id,
            userId: currentUser._id
        })

        if (!findLikeStatusInDB) {
            await commentRepository.createLikeStatus(commentInfo._id, currentUser._id, currentUser.accountData.login, newLikeStatusForComment)
            return true;
        }
        await commentRepository.updateLikeStatus(commentInfo._id, currentUser._id,  newLikeStatusForComment)

        // findLikeStatusInDB.likeStatus = newLikeStatusForComment;

        return true
        // return commentRepository.updatedCommentLikeStatusById(commentInfo._id.toString(), newLikeStatusForComment)
    },

}