import {blogsCollection} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {BlogDbType, BlogInputModel, BlogViewType} from '../../types/blog-types';

function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}

export const blogRepository = {

    // async findBlogById(id: string): Promise<BlogViewType> {
    //     const foundBlog: BlogDbType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
    //     return foundBlog ? blogMapping(foundBlog) : null;
    // },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

    },
    async createBlog(newBlog: BlogDbType): Promise<BlogViewType> {

        const result = await blogsCollection.insertOne(newBlog)
        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt.toISOString(),
            isMembership: newBlog.isMembership
        };
    },

    async updateBlog(blogId: string, blogUpdateData: BlogInputModel): Promise<boolean> {

        const result = await blogsCollection.updateOne({_id: new ObjectId(blogId)},
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

