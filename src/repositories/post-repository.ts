import {postType} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';


export function postMapping(post: any) {
    const postMongoId = post._id.toString();
    delete post._id;

    return {
        id: postMongoId,
        ...post,
        createdAt: post.createdAt.toISOString()
    }
}

export const postRepository = {
    async findPosts(): Promise<postType[]> {
        const posts = await postsCollection.find({}).toArray();
        return posts.map(post => postMapping(post))
    },

    async findPostById(id: string): Promise<postType> {
        const foundBlog: postType | null = await postsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? postMapping(foundBlog) : null;
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postType | boolean> {
        let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
        if (findBlogName) {
            let newPost: postType = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: findBlogName.name,
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
        }
        return false;
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {

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