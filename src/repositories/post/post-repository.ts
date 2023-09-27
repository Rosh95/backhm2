import {postsCollection} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {postMapping} from '../../helpers/helpers';
import {PostDBModel, postInputUpdatedDataModel, PostViewModel} from '../../types/post-types';


export const postRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const posts = await postsCollection.find({}).toArray();
        return posts.map(post => postMapping(post))
    },

    // async findPostById(id: string): Promise<PostViewModel | null> {
    //     const foundPost: PostDBModel | null = await postsCollection.findOne({_id: new ObjectId(id)});
    //     return foundPost ? postMapping(foundPost) : null;
    // },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async createPost(newPost: PostDBModel): Promise<PostViewModel> {

        const result = await postsCollection.insertOne(newPost);


        return {
            id: result.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt.toISOString()
        };

    },
    

    async updatePost(id: string, updatedPostData: postInputUpdatedDataModel): Promise<boolean> {

        const result = await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: updatedPostData.title,
                    shortDescription: updatedPostData.shortDescription,
                    content: updatedPostData.content
                }
            });

        return result.matchedCount === 1;

    }
}