import {CommentsDBType, CommentsViewModel, PaginatorCommentViewType} from '../../types/comments-types';
import {commentsCollection} from '../../db/dbMongo';
import {Filter} from 'mongodb';
import {commentsMapping, countTotalCommentsAndPages, queryDataType} from '../../helpers/helpers';


export const commentQueryRepository = {
    async getAllCommentsOfPost(postId: any, queryData: queryDataType): Promise<PaginatorCommentViewType> {
        const filter: Filter<CommentsDBType> = {postId: postId}

        const comments = await commentsCollection.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();


        let commentViewArray = comments.map(comment => commentsMapping(comment))
        let pagesCount = await countTotalCommentsAndPages(queryData, filter);


        return {
            pagesCount: pagesCount.commentsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.commentsTotalCount,
            items: commentViewArray

        };
    },
    async getAllComments(): Promise<CommentsViewModel[]> {
        let comments = await commentsCollection.find({}).toArray();
        return comments.map(comment => commentsMapping(comment))
    },
    async getAllCommentsWithFilter(filter: any) {
        return commentsCollection.countDocuments(filter);
    }
}