import {queryDataType} from '../helpers/helpers';
import {postRepository} from '../repositories/post-repository';
import {PostViewModel} from '../types/post-types';

export const postService = {
    async findPosts(queryData:queryDataType): Promise<PostViewModel[]> {
        return await postRepository.findPosts();
    },

    async findPostById(id: string): Promise<PostViewModel> {
        return await postRepository.findPostById(id)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id);

    },
    async createPost(name: string, description: string, websiteUrl: string, blogId: string): Promise<PostViewModel | boolean> {
        return await postRepository.createPost(name, description, websiteUrl, blogId);

    },

    async updatePost(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        return await postRepository.updatePost(id, name, description, websiteUrl)

    }
}