import {ObjectId} from 'mongodb';
import {CommentsDBType, CommentsInputData, CommentsViewModel} from '../types/comments-types';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {commentRepository} from '../repositories/comment/comment-repository';


export const commentsService = {
    async sendComment(comment: string, id: ObjectId | string) {
        return null;
    },
    async allFeedback(comment: string, userId: ObjectId) {
        return commentQueryRepository.getAllComments();
    },

    async getCommentById(commentId: string) {
        return await commentRepository.getCommentById(commentId);
    },

    async deleteCommentById(commentId: string) {
        return await commentRepository.deleteCommentById(commentId);
    },

    async createCommentForPost(newCommentData: CommentsInputData): Promise<CommentsViewModel> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            content: newCommentData.content,
            userId: newCommentData.userId,
            userLogin: newCommentData.userLogin,
            postId: newCommentData.postId,
            createdAt: new Date()
        }
        console.log(newComment + 'new comment in service')
        return await commentRepository.createCommentForPost(newComment)
    },

    async updateCommentById(commentId: string, commentContent: string) {
        return await commentRepository.updatedCommentById(commentId, commentContent)
    }
}