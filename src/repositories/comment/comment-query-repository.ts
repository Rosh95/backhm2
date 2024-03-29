import {CommentsDBType, CommentsViewModel, PaginatorCommentViewType} from '../../types/comments-types';
import {CommentModel} from '../../db/dbMongo';
import {commentsMapping, countTotalCommentsAndPages, queryDataType} from '../../helpers/helpers';
import {FilterQuery} from "mongoose";
import {ObjectId} from "mongodb";

export class CommentQueryRepository {
    async getAllCommentsOfPost(postId: string, queryData: queryDataType, userId?: ObjectId | null): Promise<PaginatorCommentViewType> {
        const filter: FilterQuery<CommentsDBType> = {postId: postId}

        const comments = await CommentModel.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).lean();


        let commentViewArray: CommentsViewModel[] = await Promise.all(comments.map(async comment => await commentsMapping(comment, userId)))
        let pagesCount = await countTotalCommentsAndPages(queryData, filter);


        return {
            pagesCount: pagesCount.commentsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.commentsTotalCount,
            items: commentViewArray

        };
    }

    async getCommentById(commentId: string, userId?: ObjectId | null): Promise<CommentsViewModel | null> {
        const comment = await CommentModel.findById(commentId);
        if (comment) {
            return await commentsMapping(comment, userId);
        }
        return null
    }

    async getAllComments(): Promise<CommentsViewModel[]> {
        let comments = await CommentModel.find({}).lean();
        return Promise.all(comments.map(comment => commentsMapping(comment)))
    }

    async getAllCommentsWithFilter(filter: any) {
        return CommentModel.countDocuments(filter);
    }
}

export const commentQueryRepository = new CommentQueryRepository();