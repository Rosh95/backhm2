import {countTotalPostsAndPages, postMapping, queryDataType} from '../../helpers/helpers';
import {PostModel} from '../../db/dbMongo';
import {PaginatorPostViewType, PostDBModel, PostViewModel} from '../../types/post-types';
import {ObjectId} from "mongodb";

export class PostQueryRepository {
    async getAllPosts(queryData: queryDataType, userId?: ObjectId | null): Promise<PaginatorPostViewType> {

        const posts = await PostModel.find()
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).lean();

        let postViewArray: PostViewModel[] = await Promise.all(posts.map(async post => postMapping(post, userId)))
        let pagesCount = await countTotalPostsAndPages(queryData);

        return {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray
        };
    }

    async findPostById(id: string, userId?: ObjectId | null): Promise<PostViewModel | null> {
        const foundPost: PostDBModel = <PostDBModel>await PostModel.findOne({_id: new ObjectId(id)});
        return foundPost ? postMapping(foundPost, userId) : null;
    }
}

export const postQueryRepository = new PostQueryRepository();

