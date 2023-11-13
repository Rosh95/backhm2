import {postRepository, PostRepository} from '../repositories/post/post-repository';
import {
    PostDBModel,
    postInputDataModel,
    postInputDataModelForExistingBlog,
    postInputUpdatedDataModel
} from '../types/post-types';
import {BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';
import {BlogQueryRepository, blogQueryRepository} from "../repositories/blog/blog-query-repository";
import {ResultObject} from "./device-service";
import {postQueryRepository, PostQueryRepository} from "../repositories/post/post-query-repository";
import {LikeStatusOption} from "../types/comments-types";
import {NewUsersDBType} from "../types/user-types";
import {LikeStatusDBType} from "../types/likeStatus-types";
import {LikeStatusModel} from "../db/dbMongo";

export class PostService {

    constructor(public postRepository: PostRepository,
                public postQueryRepository: PostQueryRepository,
                public blogQueryRepository: BlogQueryRepository,    ) {
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postRepository.deletePost(id);
    }

    async createPost(postInputData: postInputDataModel, foundBlog: BlogViewType): Promise<ResultObject<string>> {
        //  const user = userRepository.findUserById('')
        let newPost: PostDBModel = {
            _id: new ObjectId(),
            title: postInputData.title,
            shortDescription: postInputData.shortDescription,
            content: postInputData.content,
            blogId: postInputData.blogId,
            blogName: foundBlog.name,
            createdAt: new Date()
        }
        return await this.postRepository.createPost(newPost);
        //query reto get
    }

    async createPostForExistingBlog(blogId: string, postInputData: postInputDataModelForExistingBlog): Promise<ResultObject<string>> {
        let foundBlog = await this.blogQueryRepository.findBlogById(blogId);

        let newPost: PostDBModel = {
            _id: new ObjectId(),
            title: postInputData.title,
            shortDescription: postInputData.shortDescription,
            content: postInputData.content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: new Date()
        }
        return await this.postRepository.createPost(newPost);
    }

    async updatePost(id: string, updatedPostData: postInputUpdatedDataModel): Promise<boolean> {
        return await this.postRepository.updatePost(id, updatedPostData)
    }

    async updatePostLikeStatusById(postInfo: PostDBModel, newLikeStatusForComment: LikeStatusOption, currentUser: NewUsersDBType) {
        const findPostLikeStatusInDB: LikeStatusDBType | null = await LikeStatusModel.findOne({
            entityId: postInfo._id,
            userId: currentUser._id
        })

        if (!findPostLikeStatusInDB) {
            await this.postRepository.createLikeStatusForPost(postInfo._id, currentUser._id, currentUser.accountData.login, newLikeStatusForComment)
            return true;
        }
        await this.postRepository.updatePostLikeStatus(postInfo._id, currentUser._id, newLikeStatusForComment)

        //findLikeStatusInDB.likeStatus = newLikeStatusForComment;


        return true
        // return commentRepository.updatedCommentLikeStatusById(commentInfo._id.toString(), newLikeStatusForComment)
    }
}

export const postService = new PostService(postRepository, postQueryRepository, blogQueryRepository);
