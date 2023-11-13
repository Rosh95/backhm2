import {BlogModel, PostModel} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {
    blogMapping,
    countTotalBlogsAndPages,
    countTotalPostsAndPagesOfBlog,
    postMapping,
    queryDataType
} from '../../helpers/helpers';
import {PaginatorPostViewType, PostViewModel} from '../../types/post-types';
import {BlogDbType, BlogViewType, PaginatorBlogViewType} from '../../types/blog-types';


export class BlogQueryRepository {
    async getAllBlogs(queryData: queryDataType): Promise<PaginatorBlogViewType> {
        const filter = {name: {$regex: queryData.searchNameTerm, $options: 'i'}}

        const blogs = await BlogModel.find(filter)
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).lean();

        let blogViewArray = blogs.map((blog: BlogDbType) => blogMapping(blog))
        let pagesCount = await countTotalBlogsAndPages(queryData, filter);


        return {
            pagesCount: pagesCount.blogsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.blogsTotalCount,
            items: blogViewArray

        };

    }

    async findBlogById(id: string): Promise<BlogViewType | null> {
        const foundBlog: BlogDbType | null = await BlogModel.findOne({_id: new ObjectId(id)});
        return foundBlog ? blogMapping(foundBlog) : null;
    }

    async getAllPostOfBlog(blogId: string, queryData: queryDataType): Promise<PaginatorPostViewType> {

        let posts = await PostModel.find({blogId})
            .sort({[queryData.sortBy]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize)
            .lean();

        let postViewArray: PostViewModel[] = await Promise.all(posts.map(async post => postMapping(post)))
        let pagesCount = await countTotalPostsAndPagesOfBlog(blogId, queryData);

        return {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray

        };


    }

    async getAllPostCountOfBlog(blogId: string): Promise<number> {

        return PostModel.countDocuments({blogId: blogId});
    }

    async getAllBlogsCount(filter: any): Promise<number> {

        return BlogModel.countDocuments(filter);
    }

    async getAllPostsCount(): Promise<number> {

        return PostModel.countDocuments();
    }
}

export const blogQueryRepository = new BlogQueryRepository();

// export const blogQueryRepository = {
//     async getAllBlogs(queryData: queryDataType): Promise<PaginatorBlogViewType> {
//         const filter = {name: {$regex: queryData.searchNameTerm, $options: 'i'}}
//
//         const blogs = await BlogModel.find(filter)
//             .sort({[queryData.sortBy]: queryData.sortDirection})
//             .skip(queryData.skippedPages)
//             .limit(queryData.pageSize).lean();
//
//         let blogViewArray = blogs.map((blog: BlogDbType) => blogMapping(blog))
//         let pagesCount = await countTotalBlogsAndPages(queryData, filter);
//
//
//         return {
//             pagesCount: pagesCount.blogsPagesCount,
//             page: queryData.pageNumber,
//             pageSize: queryData.pageSize,
//             totalCount: pagesCount.blogsTotalCount,
//             items: blogViewArray
//
//         };
//
//     },
//
//     async findBlogById(id: string): Promise<BlogViewType | null> {
//         const foundBlog: BlogDbType | null = await BlogModel.findOne({_id: new ObjectId(id)});
//         return foundBlog ? blogMapping(foundBlog) : null;
//     },
//
//     async getAllPostOfBlog(blogId: string, queryData: queryDataType): Promise<PaginatorPostViewType> {
//
//         let posts = await PostModel.find({blogId})
//             .sort({[queryData.sortBy]: queryData.sortDirection})
//             .skip(queryData.skippedPages)
//             .limit(queryData.pageSize)
//             .lean();
//
//         let postViewArray: PostViewModel[] = posts.map(post => postMapping(post))
//         let pagesCount = await countTotalPostsAndPagesOfBlog(blogId, queryData);
//
//         return {
//             pagesCount: pagesCount.postsPagesCount,
//             page: queryData.pageNumber,
//             pageSize: queryData.pageSize,
//             totalCount: pagesCount.postsTotalCount,
//             items: postViewArray
//
//         };
//
//
//     },
//
//     async getAllPostCountOfBlog(blogId: string): Promise<number> {
//
//         return PostModel.countDocuments({blogId: blogId});
//     },
//     async getAllBlogsCount(filter: any): Promise<number> {
//
//         return BlogModel.countDocuments(filter);
//     },
//     async getAllPostsCount(): Promise<number> {
//
//         return PostModel.countDocuments();
//     },
// }

