import {blogRepository} from '../repositories/blog/blog-repository';
import {BlogDbType, BlogInputModel, BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';

export const blogService = {
    async deleteBlog(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id);

    },
    async createBlog(blogData: BlogInputModel): Promise<BlogViewType> {
        let newBlog: BlogDbType = {
            _id: new ObjectId(),
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return await blogRepository.createBlog(newBlog);

    },

    async updateBlog(blogId: string, blogUpdateData: BlogInputModel): Promise<boolean> {
        return await blogRepository.updateBlog(blogId, blogUpdateData)
    }
}