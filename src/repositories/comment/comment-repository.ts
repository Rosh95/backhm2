import {PostViewModel} from '../../types/post-types';
import {commentsCollection, postsCollection} from '../../db/dbMongo';
import {commentsMapping, postMapping} from '../../helpers/helpers';
import {CommentsViewModel} from '../../types/comments-types';
import {ObjectId} from 'mongodb';


export const commentRepository = {
    async getCommentById(id: ObjectId): Promise<CommentsViewModel | null> {
        const comment = await commentsCollection.findOne({_id: id});
        if (comment) {
            return commentsMapping(comment!);
        }
        return null
    },
}