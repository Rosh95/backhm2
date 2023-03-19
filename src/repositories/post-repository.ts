import {db, postType} from '../db/db';

export const postRepository = {
    findPosts() {
        return db.posts;
    },

    findPostById(id: number) {
        const foundPost = db.posts.find(b => +b.id === id);
        return foundPost ? foundPost : undefined;
    },
    deletePost(id: number) {
        for (let i = 0; i < db.posts.length; i++) {
            if (+db.posts[i].id === id) {
                db.posts.splice(i, 1)
                return true;
            }
        }
        return false;
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        let findBlogName = db.blogs.find(b => +b.id === +blogId);

        let newPost: postType = {
            id: `${Date.now()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName? findBlogName.name : 'not found'
        }

        db.posts.push(newPost);
        return newPost;
    },

    updatePost(id: number, title: string, shortDescription: string, content: string, blogId: string) {
        let foundPost = postRepository.findPostById(id);
        if (foundPost) {
            foundPost.title = title;
            foundPost.shortDescription = shortDescription;
            foundPost.content = content;
            foundPost.blogId = blogId;
            return true;
        } else {
            return false;
        }
    }
}