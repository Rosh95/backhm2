import {CommentsDBType} from '../../types/comments-types';
import {commentsCollection} from '../../db/dbMongo';
import {FindCursor, WithId} from 'mongodb';


export const commentQueryRepository = {
    async getAllComments() {
        return commentsCollection.find({});
    }
}