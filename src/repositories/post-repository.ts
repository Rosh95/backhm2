import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';
import {postMapping} from '../helpers/helpers';
import {postInputType, PostViewModel} from '../types/post-types';


export const postRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const posts = await postsCollection.find({}).toArray();
        return posts.map(post => postMapping(post))
    },

    async findPostById(id: string): Promise<PostViewModel> {
        const foundBlog: PostViewModel | null = await postsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? postMapping(foundBlog) : null;
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async createPost(newPost: postInputType): Promise<PostViewModel | boolean> {
        // let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
        //   if (foundBlogName) {
        // let newPost: postInputType = {
        //     title: title,
        //     shortDescription: shortDescription,
        //     content: content,
        //     blogId: blogId,
        //     blogName: findBlogName.name,
        //     createdAt: new Date()
        // }
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
        // }
        // return false;
    },

    // async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostViewModel | boolean> {
    async createPostForExistingBlog(newPost: postInputType): Promise<PostViewModel | boolean> {
        // let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
        //
        // let newPost: postInputType = {
        //     title: title,
        //     shortDescription: shortDescription,
        //     content: content,
        //     blogId: blogId,
        //     blogName: findBlogName!.name,
        //     createdAt: new Date()
        // }

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

    async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {

        const result = await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                }
            });

        return result.matchedCount === 1;

    }
}