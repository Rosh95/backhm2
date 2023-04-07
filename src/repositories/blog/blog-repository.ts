import {blogsCollection} from '../../db/dbMongo';
import {ObjectId} from 'mongodb';
import {BlogInputModel, BlogViewType} from '../../types/blog-types';

function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}

export const blogRepository = {

    async findBlogById(id: string): Promise<BlogViewType> {
        const foundBlog: BlogViewType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? blogMapping(foundBlog) : null;
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

    },
    async createBlog(newBlog: BlogInputModel): Promise<BlogViewType> {

        // @ts-ignore
        const result = await blogsCollection.insertOne(newBlog)
        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        };
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                }
            });
        return result.matchedCount === 1;
    },
}

