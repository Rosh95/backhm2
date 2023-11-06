import {CommentsDBType, CommentsViewModel, PaginatorCommentViewType} from '../../types/comments-types';
import {CommentModel} from '../../db/dbMongo';
import {commentsMapping, countTotalCommentsAndPages, queryDataType} from '../../helpers/helpers';
import {FilterQuery} from "mongoose";
import {ObjectId} from "mongodb";


export const commentQueryRepository = {
    async getAllCommentsOfPost(postId: string, queryData: queryDataType): Promise<PaginatorCommentViewType> {
        const filter: FilterQuery<CommentsDBType> = {postId: postId}

        const comments = await CommentModel.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).lean();


        let commentViewArray: CommentsViewModel[] = await Promise.all(comments.map(async comment => await commentsMapping(comment)))
        let pagesCount = await countTotalCommentsAndPages(queryData, filter);


        return {
            pagesCount: pagesCount.commentsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.commentsTotalCount,
            items: commentViewArray

        };
    },
    async getCommentById(commentId: string): Promise<CommentsViewModel | null> {
        const comment = await CommentModel.findById(commentId);
        if (comment) {
            return commentsMapping(comment);
        }
        return null
    },
    async getAllComments(): Promise<CommentsViewModel[]> {
        let comments = await CommentModel.find({}).lean();
        return Promise.all(comments.map(comment => commentsMapping(comment)))
    },
    async getAllCommentsWithFilter(filter: any) {
        return CommentModel.countDocuments(filter);
    }
}