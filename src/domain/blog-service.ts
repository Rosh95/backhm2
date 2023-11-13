import {BlogRepository, blogRepository} from '../repositories/blog/blog-repository';
import {BlogDbType, BlogInputModel, BlogViewType} from '../types/blog-types';
import {ObjectId} from 'mongodb';
import {blogQueryRepository, BlogQueryRepository} from "../repositories/blog/blog-query-repository";


export class BlogService {
    constructor(protected blogQueryRepository: BlogQueryRepository,
                protected blogRepository: BlogRepository) {
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogRepository.deleteBlog(id);
    }

    async createBlog(blogData: BlogInputModel): Promise<BlogViewType> {
        let newBlog: BlogDbType = {
            _id: new ObjectId(),
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return await this.blogRepository.createBlog(newBlog);
    }

    async updateBlog(blogId: string, blogUpdateData: BlogInputModel): Promise<boolean> {
        return await this.blogRepository.updateBlog(blogId, blogUpdateData)
    }
}

export const blogService = new BlogService(blogQueryRepository, blogRepository)
