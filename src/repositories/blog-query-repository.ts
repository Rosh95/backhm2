import {blogsCollection, postsCollection} from '../db/dbMongo';
import {Filter, ObjectId, SortDirection} from 'mongodb';
import {
    blogMapping,
    countTotalBlogsAndPages,
    countTotalPostsAndPagesOfBlog,
    postMapping,
    queryDataType,
    skipPages
} from '../helpers/helpers';
import {PaginatorPostViewType, postInputType, PostViewModel} from '../types/post-types';
import {BlogViewType, PaginatorBlogViewType} from '../types/blog-types';


export const blogQueryRepository = {
    async getAllBlogs(queryData: queryDataType): Promise<PaginatorBlogViewType> {
        //TODO: searcnName Term
        const filter: Filter<BlogViewType> = {name: {$regex: queryData.searchName, options: 'i'}}

        const blogs = await blogsCollection.find(filter)
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();

     //   const countOfBlogs = await blogsCollection.countDocuments(filter)

        let blogViewArray = blogs.map(blog => blogMapping(blog))
        let pagesCount = await countTotalBlogsAndPages(queryData, filter);


        const result = {
            pagesCount: pagesCount.blogsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.blogsTotalCount,
            items: blogViewArray

        }

        return result;

    },
    async getAllPostOfBlog(blogId: any, queryData: queryDataType): Promise<PaginatorPostViewType> {
        //let skippedPages = skipPages(queryData.pageNumber, queryData.pageSize);
        // let sortDirectionInMongoDb: SortDirection = sortDirection === 'desc' ? -1 : 1;
        //    .sort({[sortByProp]: sortDirectionInMongoDb})

        console.log(queryData.sortByProp, queryData.sortDirection)
        let posts = await postsCollection.find({blogId})
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize)
            .toArray();

        let postViewArray: PostViewModel[] = posts.map(post => postMapping(post))
        let pagesCount = await countTotalPostsAndPagesOfBlog( blogId, queryData);


        const result = {
            pagesCount: pagesCount.postsPagesCount,
            page: queryData.pageNumber,
            pageSize: queryData.pageSize,
            totalCount: pagesCount.postsTotalCount,
            items: postViewArray

        }

        return result;


    },

    async getAllPostCountOfBlog(blogId: any): Promise<number> {

        let totalCount = await postsCollection.countDocuments({blogId: blogId});

        return totalCount;
    },
    async getAllBlogsCount(filter: any): Promise<number> {

        let totalCount = await blogsCollection.countDocuments(filter);

        return totalCount;
    },
    async getAllPostsCount(): Promise<number> {

        let totalCount = await postsCollection.countDocuments();

        return totalCount;
    },


    async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostViewModel | boolean> {
        let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});

        let newPost: postInputType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName!.name,
            createdAt: new Date()
        }
        // @ts-ignore
        const result = await postsCollection.insertOne(newPost)

        return {
            id: result.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        };

    },
}

