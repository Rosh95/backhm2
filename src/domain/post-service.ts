import {postRepository} from '../repositories/post/post-repository';
import {
    PostDBModel,
    postInputDataModel,
    postInputDataModelForExistingBlog,
    postInputUpdatedDataModel
} from '../types/post-types';
import {BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';
import {blogQueryRepository} from "../repositories/blog/blog-query-repository";
import {ResultObject} from "./device-service";

export const postService = {

    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id);
    },
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

        return await postRepository.createPost(newPost);

        //query reto get
    },
    async createPostForExistingBlog(blogId: string, postInputData: postInputDataModelForExistingBlog): Promise<ResultObject<string>> {
        let foundBlog = await blogQueryRepository.findBlogById(blogId);

        let newPost: PostDBModel = {
            _id: new ObjectId(),
            title: postInputData.title,
            shortDescription: postInputData.shortDescription,
            content: postInputData.content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: new Date()
        }

        return await postRepository.createPost(newPost);
    },


    async updatePost(id: string, updatedPostData: postInputUpdatedDataModel): Promise<boolean> {

        return await postRepository.updatePost(id, updatedPostData)

    }
}