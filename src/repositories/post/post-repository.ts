import {PostModel} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {PostDBModel, postInputUpdatedDataModel} from '../../types/post-types';
import {ResultCode, ResultObject} from "../../domain/device-service";
import exp from "constants";

export class PostRepository {
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async createPost(newPost: PostDBModel): Promise<ResultObject<string>> {
        const result = await PostModel.create(newPost);
        if (result) {
            return {
                data: result._id.toString(),
                resultCode: ResultCode.NoContent,
                errorMessage: 'create a new post'
            }
        }
        return {
            data: null,
            resultCode: ResultCode.BadRequest,
            errorMessage: 'couldn`t create a new post'
        }
        // return {
        //     id: result.insertedId.toString(),
        //     title: newPost.title,
        //     shortDescription: newPost.shortDescription,
        //     content: newPost.content,
        //     blogId: newPost.blogId,
        //     blogName: newPost.blogName,
        //     createdAt: newPost.createdAt.toISOString()
        // };

    }

    async updatePost(id: string, updatedPostData: postInputUpdatedDataModel): Promise<boolean> {

        const result = await PostModel.updateOne({_id: new ObjectId(id)},
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

export const postRepository = new PostRepository();
