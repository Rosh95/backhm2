import {blogsCollection, commentsCollection} from '../../db/dbMongo';
import {commentsMapping} from '../../helpers/helpers';
import {CommentsDBType, CommentsViewModel} from '../../types/comments-types';
import {ObjectId} from 'mongodb';


export const commentRepository = {
    async getCommentById(commentId: string): Promise<CommentsViewModel | null> {
        const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
        if (comment) {
            return commentsMapping(comment);
        }
        return null
    },
    async createCommentForPost(newComment: CommentsDBType): Promise<CommentsViewModel> {
        await commentsCollection.insertOne(newComment)
        return commentsMapping(newComment)
    },

    async deleteCommentById(commentId: string) {
        const result = await commentsCollection.deleteOne({_id: new ObjectId(commentId)});
        console.log(result)
        return result.deletedCount === 1;
    },

    async updatedCommentById(commentId: string, commentContent: string) {
        const result = await commentsCollection.updateOne({_id: new ObjectId(commentId)},
            {
                $set: {
                    content: commentContent,
                }
            });
        return result.matchedCount === 1;

    }

}