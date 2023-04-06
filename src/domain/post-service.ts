import {queryDataType} from '../helpers/helpers';
import {postRepository} from '../repositories/post-repository';
import {postInputType, PostViewModel} from '../types/post-types';
import {blogRepository} from '../repositories/blog-repository';
import {BlogInputModel, BlogViewType} from '../types/blog-types';
import {blogsCollection} from '../db/dbMongo';
import {ObjectId} from 'mongodb';

export const postService = {
    async findPosts(queryData: queryDataType): Promise<PostViewModel[]> {
        return await postRepository.findPosts();
    },

    async findPostById(id: string): Promise<PostViewModel> {
        return await postRepository.findPostById(id)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id);

    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string, foundBlogName: BlogViewType): Promise<PostViewModel | boolean> {
        // let foundBlogName = await blogRepository.findBlogById(blogId)
        // if (!foundBlogName) {
        //     return false;
        // }
        let newPost: postInputType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlogName.name,
            createdAt: new Date()
        }

        return await postRepository.createPost(newPost);
    },
    async createPostForExistingBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostViewModel | boolean> {
       // let findBlogName = await blogsCollection.findOne({_id: new ObjectId(blogId.toString())});
        let foundBlog =  await blogRepository.findBlogById(blogId);

        let newPost: postInputType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: new Date()
        }



        // return await postRepository.createPostForExistingBlog(blogId, title, shortDescription, content);
        return await postRepository.createPostForExistingBlog(newPost);
    },


    async updatePost(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {

        return await postRepository.updatePost(id, title, shortDescription, content)

    }
}