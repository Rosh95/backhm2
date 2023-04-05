import {blogType, postType} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId, SortDirection} from 'mongodb';
import {postMapping} from './post-repository';

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


export const blogQueryRepository = {

    async getAllPostOfBlog(blogId: any, pageNumber: number, pageSize: number, sortByProp: string, sortDirection: string): Promise<postType[]> {
        let skippedPages = skipPages(pageNumber, pageSize);
        let sortDirectionInMongoDb: SortDirection = sortDirection === 'desc' ? -1 : 1;
        console.log(sortByProp, sortDirectionInMongoDb)
        let posts = await postsCollection.find({blogId})
            .sort({[sortByProp]: sortDirectionInMongoDb})
            .skip(skippedPages)
            .limit(pageSize)
            .toArray();


        return posts.map(post => postMapping(post))
    },

    async getAllPostCount(blogIdd: any): Promise<number> {

        let totalCount = await postsCollection.countDocuments({blogId: blogIdd});

        return totalCount;
    },


    async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<postType | boolean> {
        let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});

        let newPost: postType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName!.name,
            createdAt: new Date()
        }
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

