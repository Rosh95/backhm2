import {queryDataType} from '../helpers/helpers';
import {postRepository} from '../repositories/post/post-repository';
import {
    PostDBModel,
    postInputDataModel,
    postInputDataModelForExistingBlog,
    postInputUpdatedDataModel,
    PostViewModel
} from '../types/post-types';
import {blogRepository} from '../repositories/blog/blog-repository';
import {BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';
import {blogQueryRepository} from "../repositories/blog/blog-query-repository";

export const postService = {
    async findPosts(queryData: queryDataType): Promise<PostViewModel[]> {
        return await postRepository.findPosts();
    },

    // async findPostById(id: string): Promise<PostViewModel | null> {
    //     return await postRepository.findPostById(id)
    // },
    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id);
    },
    async createPost(postInputData: postInputDataModel, foundBlogName: BlogViewType): Promise<PostViewModel> {

        let newPost: PostDBModel = {
            _id: new ObjectId(),
            title: postInputData.title,
            shortDescription: postInputData.shortDescription,
            content: postInputData.content,
            blogId: postInputData.blogId,
            blogName: foundBlogName.name,
            createdAt: new Date()
        }

        return await postRepository.createPost(newPost);
    },
    async createPostForExistingBlog(blogId: string, postInputData: postInputDataModelForExistingBlog): Promise<PostViewModel | boolean> {
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