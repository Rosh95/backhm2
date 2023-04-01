import {blogType} from '../db/db';
import {blogsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';

function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}


export const blogRepository = {
    async findBlogs() {
        const blogs = await blogsCollection.find({}).toArray();
        return blogs.map(blog => blogMapping(blog))
    },

    async findBlogById(id: string) {
        const foundBlog: blogType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? blogMapping(foundBlog) : null;
    },
    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

        // for (let i = 0; i < db.blogs.length; i++) {
        //     if (+db.blogs[i].id === id) {
        //         db.blogs.splice(i, 1)
        //         return true;
        //     }
        // }
        // return false;
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogType> {

        let newBlog: blogType = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog)

        //       db.blogs.push(newBlog);
        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        };
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                }
            });

        return result.matchedCount === 1;


        // let foundBlog = await blogRepository.findBlogById(id);
        // if (foundBlog) {
        //     foundBlog.name = name;
        //     foundBlog.description = description;
        //     foundBlog.websiteUrl = websiteUrl;
        //     return true;
        // } else {
        //     return false;
        // }
    }
}