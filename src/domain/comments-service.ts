import {FindCursor, ObjectId, WithId} from 'mongodb';
import {CommentsDBType, CommentsViewModel} from '../types/comments-types';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {commentRepository} from '../repositories/comment/comment-repository';
import {PostViewModel} from '../types/post-types';
import {UsersDBType} from '../types/user-types';


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

    async createCommentForPost(userId: any, userLogin: any, postId: string, commentContent: string): Promise<CommentsViewModel> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            content: commentContent,
            userId: userId,
            userLogin: userLogin,
            postId: postId,
            createdAt: new Date()
        }
        return await commentRepository.createCommentForPost(newComment)
    },

    async updateCommentById(commentId: string, commentContent: string){
        return await commentRepository.updatedCommentById(commentId, commentContent)
    }
}