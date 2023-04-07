import {blogsCollection, postsCollection} from '../db/dbMongo';
import {Filter} from 'mongodb';
import {
    blogMapping,
    countTotalBlogsAndPages,
    countTotalPostsAndPagesOfBlog,
    postMapping,
    queryDataType
} from '../helpers/helpers';
import {PaginatorPostViewType, PostViewModel} from '../types/post-types';
import {BlogViewType, PaginatorBlogViewType} from '../types/blog-types';


export const blogQueryRepository = {
    async getAllBlogs(queryData: queryDataType): Promise<PaginatorBlogViewType> {
        const filter: Filter<BlogViewType> = {name: {$regex: queryData.searchNameTerm, $options: 'i'}}

        const blogs = await blogsCollection.find(filter)
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();


        let blogViewArray = blogs.map(blog => blogMapping(blog))
        let pagesCount = await countTotalBlogsAndPages(queryData, filter);


        return {
            pagesCount: pagesCount.blogsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.blogsTotalCount,
            items: blogViewArray

        };

    },
    async getAllPostOfBlog(blogId: any, queryData: queryDataType): Promise<PaginatorPostViewType> {

        let posts = await postsCollection.find({blogId})
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize)
            .toArray();

        let postViewArray: PostViewModel[] = posts.map(post => postMapping(post))
        let pagesCount = await countTotalPostsAndPagesOfBlog(blogId, queryData);

        return {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray

        };


    },

    async getAllPostCountOfBlog(blogId: any): Promise<number> {

        return await postsCollection.countDocuments({blogId: blogId});
    },
    async getAllBlogsCount(filter: any): Promise<number> {

        return await blogsCollection.countDocuments(filter);
    },
    async getAllPostsCount(): Promise<number> {

        return await postsCollection.countDocuments();
    },
}

