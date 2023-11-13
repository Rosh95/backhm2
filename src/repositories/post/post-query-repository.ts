import {countTotalPostsAndPages, postMapping, queryDataType} from '../../helpers/helpers';
import {PostModel} from '../../db/dbMongo';
import {PaginatorPostViewType, PostDBModel, PostViewModel} from '../../types/post-types';
import {ObjectId} from "mongodb";

export class PostQueryRepository {
    async getAllPosts(queryData: queryDataType): Promise<PaginatorPostViewType> {

        const posts = await PostModel.find()
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).lean();

        let postViewArray: PostViewModel[] = await Promise.all(posts.map(post => postMapping(post)))
        let pagesCount = await countTotalPostsAndPages(queryData);

        return {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray
        };
    }

    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost: PostDBModel = <PostDBModel>await PostModel.findOne({_id: new ObjectId(id)});
        return foundPost ? postMapping(foundPost) : null;
    }
}

export const postQueryRepository = new PostQueryRepository();

