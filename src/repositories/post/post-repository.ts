import {LikeStatusModel, PostModel} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {PostDBModel, postInputUpdatedDataModel} from '../../types/post-types';
import {ResultCode, ResultObject} from "../../domain/device-service";
import {LikeStatusOption} from "../../types/comments-types";
import {LikeStatusDBType} from "../../types/likeStatus-types";

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

    async getPostById(postId: string): Promise<PostDBModel | null> {
        const foundPost = await PostModel.findById(postId);
        if (foundPost) {
            return foundPost;
        }
        return null
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

    async createLikeStatusForPost(entityId: ObjectId, userId: ObjectId, userLogin: string, likeStatus: LikeStatusOption) {
        const newLikeStatus: LikeStatusDBType = {
            entityId: entityId.toString(),
            userId: userId.toString(),
            userLogin,
            likeStatus,
            createdAt: new Date()
        }
        const result = await LikeStatusModel.create(newLikeStatus)
        return true;
    }

    async updatePostLikeStatus(entityId: ObjectId, userId: ObjectId, likeStatus: LikeStatusOption) {
        // const newLikeStatus: LikeStatusDBType = {
        //     entityId: entityId.toString(),
        //     userId: userId.toString(),
        //     userLogin,
        //     likeStatus,
        //     createdAt: new Date()
        // }
        const result = await LikeStatusModel.findOneAndUpdate({entityId, userId}, {
            $set: {
                likeStatus: likeStatus,
            }
        })
        return true;
    }

}

export const postRepository = new PostRepository();
