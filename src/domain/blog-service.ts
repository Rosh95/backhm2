import {blogRepository} from '../repositories/blog-repository';
import {queryDataType} from '../helpers/helpers';
import {BlogViewType} from '../types/blog-types';

export const blogService = {
    async findBlogs(queryData: queryDataType): Promise<BlogViewType[]> {
        return await blogRepository.findBlogs(queryData);
    },

    async findBlogById(id: string): Promise<BlogViewType> {
        return await blogRepository.findBlogById(id)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id);

    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewType> {
        return await blogRepository.createBlog(name, description, websiteUrl);

    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        return await blogRepository.updateBlog(id, name, description, websiteUrl)

    }
}