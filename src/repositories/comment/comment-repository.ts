import {CommentModel} from '../../db/dbMongo';
import {commentsMapping} from '../../helpers/helpers';
import {CommentsDBType, CommentsViewModel} from '../../types/comments-types';
import {ObjectId} from 'mongodb';


export const commentRepository = {
    async createCommentForPost(newComment: CommentsDBType): Promise<CommentsViewModel> {
        await CommentModel.create(newComment)
        return commentsMapping(newComment)
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

    }

}