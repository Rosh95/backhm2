import {ObjectId} from 'mongodb';
import {BlogDbType, BlogInputModel, BlogViewType} from '../../types/blog-types';
import {BlogModel} from "../../db/dbMongo";

export const blogRepository = {

    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

    },
    async createBlog(newBlog: BlogDbType): Promise<BlogViewType> {

        const result = await BlogModel.create(newBlog)
        return {
            id: result._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt.toISOString(),
            isMembership: newBlog.isMembership
        };
    },

    async updateBlog(blogId: string, blogUpdateData: BlogInputModel): Promise<boolean> {

        const result = await BlogModel.updateOne({_id: new ObjectId(blogId)},
            {
                $set: {
                    name: blogUpdateData.name,
                    description: blogUpdateData.description,
                    websiteUrl: blogUpdateData.websiteUrl,
                }
            });
        return result.matchedCount === 1;
    },
}

