import {blogType, postType} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';
import {postMapping} from './post-repository';

function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}

function skipPages(pageNumber: string, pageSize: string) {
    let result = (+pageNumber - 1) * (+pageSize);
    return result;
}


export const blogRepository = {
    async findBlogs(): Promise<blogType[]> {
        const blogs = await blogsCollection.find({}).toArray();
        return blogs.map(blog => blogMapping(blog))
    },

    async findBlogById(id: string): Promise<blogType> {
        const foundBlog: blogType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? blogMapping(foundBlog) : null;
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

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
    async getAllPostOfBlog(blogIdd: any, pageNumber: string, pageSize: string, sortByProp: string, sortDirection: string): Promise<postType[]> {

        let skippedPages = skipPages(pageNumber, pageSize);
        let sortDirectionInMongoDb: number = sortDirection === 'asc' ? 1 : -1;
        let posts;
        if (sortDirectionInMongoDb === 1) {
            posts = await postsCollection.find({blogId: blogIdd}).skip(skippedPages).limit(+pageSize).sort({sortByProp: 1}).toArray();
        } else {
            posts = await postsCollection.find({blogId: blogIdd}).skip(skippedPages).limit(+pageSize).sort({sortByProp: -1}).toArray();
        }

        return posts.map(post => postMapping(post))
    },
    async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<postType | boolean> {
        let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});

            let newPost: postType = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: findBlogName!.name,
                createdAt: new Date().toISOString()
            }
            const result = await postsCollection.insertOne(newPost)

            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };

    },
}

