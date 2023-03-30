import {blogType, db} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';

export const blogRepository = {
    async findBlogs() {
        return await blogsCollection.find({}, {projection: {_id: false}}).toArray();
    },

    async findBlogById(id: number) {
        const foundBlog = await blogsCollection.findOne({id: id.toString()}, {projection: {_id: false}});
        return foundBlog;
    },
    async deleteBlog(id: number) {
        const result = await blogsCollection.deleteOne({id: id.toString()});
        return result.deletedCount === 1;

        // for (let i = 0; i < db.blogs.length; i++) {
        //     if (+db.blogs[i].id === id) {
        //         db.blogs.splice(i, 1)
        //         return true;
        //     }
        // }
        // return false;
    },
    async createBlog(name: string, description: string, websiteUrl: string) {

        let newBlog: blogType = {
            id: `${Date.now()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog)

        //       db.blogs.push(newBlog);
        return newBlog;
    },

    async updateBlog(id: number, name: string, description: string, websiteUrl: string) {

        const result = await blogsCollection.updateOne({id: id.toString()},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                    createdAt: new Date().toISOString(),
                    isMembership: false
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