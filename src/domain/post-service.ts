import {queryDataType} from '../helpers/helpers';
import {postRepository} from '../repositories/post/post-repository';
import {postInputType, PostViewModel} from '../types/post-types';
import {blogRepository} from '../repositories/blog/blog-repository';
import {BlogViewType} from '../types/blog-types';

export const postService = {
    async findPosts(queryData: queryDataType): Promise<PostViewModel[]> {
        return await postRepository.findPosts();
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postRepository.findPostById(id)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string, foundBlogName: BlogViewType): Promise<PostViewModel | boolean> {

        let newPost: postInputType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlogName.name,
            createdAt: new Date().toISOString()
        }

        return await postRepository.createPost(newPost);
    },
    async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostViewModel | boolean> {
        let foundBlog = await blogRepository.findBlogById(blogId);

        let newPost: postInputType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: new Date().toISOString()
        }

        return await postRepository.createPostForExistingBlog(newPost);
    },


    async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {

        return await postRepository.updatePost(id, title, shortDescription, content)

    }
}