import {FindCursor, ObjectId, WithId} from 'mongodb';
import {CommentsDBType} from '../types/comments-types';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {commentRepository} from '../repositories/comment/comment-repository';


export const commentsService = {
    async sendComment(comment: string, id: ObjectId | string) {
        return null;
    },
    async allFeedback(comment: string, userId: ObjectId) {
        return commentQueryRepository.getAllComments();
    },

    async getCommentById(id: string) {
        const newId = new ObjectId(id);
        return await commentRepository.getCommentById(newId);
    }
}