import {blogType, db} from '../db/db';

export const blogRepository = {
    findBlogs() {
        return db.blogs;
    },

    findBlogById(id: number) {
        const foundBlog = db.blogs.find(b => +b.id === id);
        return foundBlog ? foundBlog : undefined;
    },
    deleteBlog(id: number) {
        for (let i = 0; i < db.blogs.length; i++) {
            if (+db.blogs[i].id === id) {
                db.blogs.splice(i, 1)
                return true;
            }
        }
        return false;
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        let newBlog: blogType = {
            id: `${Date.now()}`,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }

        db.blogs.push(newBlog);
        return newBlog;
    },

    updateBlog(id: number, name: string, description: string, websiteUrl: string) {
        let foundBlog = blogRepository.findBlogById(id);
        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    }
}