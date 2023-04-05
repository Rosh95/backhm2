import {blogsCollection, postsCollection} from '../db/dbMongo';
import {Filter, ObjectId, SortDirection} from 'mongodb';
import {queryDataType} from '../helpers/helpers';
import {BlogInputModel, BlogViewType} from '../types/blog-types';

function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}

function skipPages(pageNumber: number, pageSize: number) {
    let result = (+pageNumber - 1) * (+pageSize);
    return result;
}


export const blogRepository = {
    async findBlogs(queryData: queryDataType): Promise<BlogViewType[]> {
        //TODO: searcnName Term
        const filter: Filter<BlogViewType> = {name: {$regex: '', options: 'i'}}

        const blogs = await blogsCollection.find(filter)
            .sort({[queryData.sortByProp]: queryData.sortDirection})
            .skip(queryData.skippedPages)
            .limit(queryData.pageSize).toArray();

        const countOfBlogs = await blogsCollection.countDocuments(filter)

        return blogs.map(blog => blogMapping(blog))

    },

    async findBlogById(id: string): Promise<BlogViewType> {
        const foundBlog: BlogViewType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? blogMapping(foundBlog) : null;
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewType> {

        let newBlog: BlogInputModel = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        // @ts-ignore
        const result = await blogsCollection.insertOne(newBlog)

        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        };
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                }
            });

        return result.matchedCount === 1;

    },
    // async getAllPostOfBlog(blogId: any, pageNumber: number, pageSize: number, sortByProp: string, sortDirection: string): Promise<postType[]> {
    //     let skippedPages = skipPages(pageNumber, pageSize);
    //     let sortDirectionInMongoDb: SortDirection = sortDirection === 'desc' ? -1 : 1;
    //     console.log(sortByProp, sortDirectionInMongoDb)
    //     let posts = await postsCollection.find({blogId})
    //         .sort({[sortByProp]: sortDirectionInMongoDb})
    //         .skip(skippedPages)
    //         .limit(pageSize)
    //         .toArray();
    //
    //
    //     return posts.map(post => postMapping(post))
    // },
    //
    // async getAllPostCount(blogIdd: any): Promise<number> {
    //
    //     let totalCount = await postsCollection.countDocuments({blogId: blogIdd})
    //
    //
    //     return totalCount;
    // },
    //
    //
    // async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<postType | boolean> {
    //     let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
    //
    //     let newPost: postType = {
    //         title: title,
    //         shortDescription: shortDescription,
    //         content: content,
    //         blogId: blogId,
    //         blogName: findBlogName!.name,
    //         createdAt: new Date()
    //     }
    //     const result = await postsCollection.insertOne(newPost)
    //
    //     return {
    //         id: result.insertedId.toString(),
    //         title: newPost.title,
    //         shortDescription: newPost.shortDescription,
    //         content: newPost.content,
    //         blogId: newPost.blogId,
    //         blogName: newPost.blogName,
    //         createdAt: newPost.createdAt
    //     };
    //
    // },
}

