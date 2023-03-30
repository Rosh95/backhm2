import {db, postType} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';

export const postRepository = {
    async findPosts() {
        return postsCollection.find({}, {projection: {_id: false}}).toArray();
    },

    async findPostById(id: number) {
        const foundBlog = await postsCollection.findOne({id: id.toString()}, {projection: {_id: false}});
        return foundBlog;
    },
    async deletePost(id: number) {
        const result = await postsCollection.deleteOne({id: id.toString()});
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
        let findBlogName = await blogsCollection.findOne({id: blogId.toString()});

        let newPost: postType = {
            id: `${Date.now()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName ? findBlogName.name : 'not found',
            createdAt: new Date().toISOString()
        }
        const result = await postsCollection.insertOne(newPost)

        //      db.posts.push(newPost);
        return newPost;
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, blogId: string) {

        const result = await blogsCollection.updateOne({id: id.toString()},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    createdAt: new Date().toISOString(),
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