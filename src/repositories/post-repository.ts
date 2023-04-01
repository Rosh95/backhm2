import {postType} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';


function postMapping(post: any) {
    const postMongoId = post._id.toString();
    delete post._id;

    return {
        id: postMongoId,
        ...post
    }
}

export const postRepository = {
    async findPosts() {
        const posts = await postsCollection.find({}).toArray();
        return posts.map(post => postMapping(post))
    },

    async findPostById(id: string) {
        const foundBlog: postType | null = await postsCollection.findOne({_id: new ObjectId(id)});
        return foundBlog ? postMapping(foundBlog) : null;
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;

        // for (let i = 0; i < db.posts.length; i++) {
        //     if (+db.posts[i].id === id) {
        //         db.posts.splice(i, 1)
        //         return true;
        //     }
        // }
        // return false;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
        if (findBlogName) {
            let newPost: postType = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: findBlogName.name,
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
        }
        return false;
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                }
            });

        return result.matchedCount === 1;

    }
    //     let foundPost = await postRepository.findPostById(id);
    //     if (foundPost) {
    //         foundPost.title = title;
    //         foundPost.shortDescription = shortDescription;
    //         foundPost.content = content;
    //         foundPost.blogId = blogId;
    //         foundPost.createdAt = new Date().toISOString()
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}