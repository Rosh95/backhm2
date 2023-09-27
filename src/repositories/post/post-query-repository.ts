import {countTotalPostsAndPages, postMapping, queryDataType} from '../../helpers/helpers';
import {postsCollection} from '../../db/dbMongo';
import {PaginatorPostViewType, PostDBModel, PostViewModel} from '../../types/post-types';
import {ObjectId} from "mongodb";

export const postQueryRepository = {
    async getAllPosts(queryData: queryDataType): Promise<PaginatorPostViewType> {
        const posts = await postsCollection.find()
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();

        let postViewArray: PostViewModel[] = posts.map(post => postMapping(post))
        let pagesCount = await countTotalPostsAndPages(queryData);

        return {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray
        };
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost: PostDBModel | null = await postsCollection.findOne({_id: new ObjectId(id)});
        return foundPost ? postMapping(foundPost) : null;
    },
}