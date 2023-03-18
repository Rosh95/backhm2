"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    findPosts() {
        return db_1.db.posts;
    },
    findPostById(id) {
        const foundPost = db_1.db.posts.find(b => +b.id === id);
        return foundPost ? foundPost : undefined;
    },
    deletePost(id) {
        for (let i = 0; i < db_1.db.posts.length; i++) {
            if (+db_1.db.posts[i].id === id) {
                db_1.db.posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    createPost(title, shortDescription, content, blogId, blogName) {
        let newPost = {
            id: `${Date.now()}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName
        };
        db_1.db.posts.push(newPost);
        return newPost;
    },
    updatePost(id, title, shortDescription, content, blogId, blogName) {
        let foundPost = exports.postRepository.findPostById(id);
        if (foundPost) {
            foundPost.title = title;
            foundPost.shortDescription = shortDescription;
            foundPost.content = content;
            foundPost.blogId = blogId;
            foundPost.blogName = blogName;
            return true;
        }
        else {
            return false;
        }
    }
};
