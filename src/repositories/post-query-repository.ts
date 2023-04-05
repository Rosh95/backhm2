import {
    blogMapping,
    countTotalBlogsAndPages, countTotalPostsAndPages,
    countTotalPostsAndPagesOfBlog,
    postMapping,
    queryDataType
} from '../helpers/helpers';
import {BlogViewType, PaginatorBlogViewType} from '../types/blog-types';
import {Filter} from 'mongodb';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {PaginatorPostViewType, PostViewModel} from '../types/post-types';

export const postRepository = {
    async getAllPosts(queryData: queryDataType): Promise<PaginatorPostViewType> {
        // //TODO: searcnName Term
        // const filter: Filter<BlogViewType> = {name: {$regex: queryData.searchName, options: 'i'}}

        const posts = await blogsCollection.find()
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();

        //   const countOfBlogs = await blogsCollection.countDocuments(filter)

        let postViewArray: PostViewModel[] = posts.map(post => postMapping(post))
        let pagesCount = await countTotalPostsAndPages(queryData);


        const result = {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray

        }

        return result;

    },
}