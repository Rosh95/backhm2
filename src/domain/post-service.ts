// import {blogType, postType} from '../db/db';
//
// import {blogRepository} from '../repositories/blog-repository';
// import {queryDataType} from '../helpers/helpers';
// import {postRepository} from '../repositories/post-repository';
//
// export const postService = {
//     async findPosts(queryData:queryDataType): Promise<postType[]> {
//         return await postRepository.findPosts();
//     },
//
//     async findPostById(id: string): Promise<postType> {
//         return await postRepository.findPostById(id)
//     },
//     async deletePost(id: string): Promise<boolean> {
//         return await postRepository.deletePost(id);
//
//     },
//     async createBlog(name: string, description: string, websiteUrl: string): Promise<postType> {
//         return await postRepository.createPost(name, description, websiteUrl);
//
//     },
//
//     async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
//
//         return await postRepository.updatePost(id, name, description, websiteUrl)
//
//     }
// }