import {blogType} from '../db/db';

import {blogRepository} from '../repositories/blog-repository';

export const blogService = {
    async findBlogs(): Promise<blogType[]> {
        return await blogRepository.findBlogs();
    },

    async findBlogById(id: string): Promise<blogType> {
        return await blogRepository.findBlogById(id)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id);

    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogType> {
        return await blogRepository.createBlog(name, description, websiteUrl);

    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        return await blogRepository.updateBlog(id, name, description, websiteUrl)

    }
}