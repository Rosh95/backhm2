import {blogRepository} from '../repositories/blog/blog-repository';
import {BlogDbType, BlogInputModel, BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';

export const blogService = {
    // async findBlogs(queryData: queryDataType): Promise<BlogViewType[]> {
    //     return await blogRepository.findBlogs(queryData);
    // },

    async findBlogById(id: string): Promise<BlogViewType> {
        return await blogRepository.findBlogById(id)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id);

    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewType> {

        let newBlog: BlogDbType = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return await blogRepository.createBlog(newBlog);

    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        return await blogRepository.updateBlog(id, name, description, websiteUrl)

    }
}