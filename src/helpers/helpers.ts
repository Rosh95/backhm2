import {SortDirection} from 'mongodb';
import {blogQueryRepository} from '../repositories/blog/blog-query-repository';
import {usersQueryRepository} from '../repositories/user/user-query-repository';
import {PostViewModel} from '../types/post-types';

export  type  queryDataType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchNameTerm?: string,
    searchLoginTerm?: string,
    searchEmailTerm?: string,
    skippedPages: number
}
export const getDataFromQuery = async (query: any): Promise<queryDataType> => {

    let pageNumber: number = query.pageNumber ? +query.pageNumber : 1; // NaN
    let pageSize: number = query.pageSize ? +query.pageSize : 10; // NaN
    let sortBy: string = query.sortBy ? query.sortBy : 'createdAt';
    let sortDirection: SortDirection = query.sortDirection === 'asc' ? 1 : -1;
    let searchNameTerm = query.searchNameTerm ? query.searchNameTerm : '';
    let searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : '';
    let searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : '';
    let skippedPages: number = skipPages(pageNumber, pageSize);

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
        searchLoginTerm,
        searchEmailTerm,
        skippedPages
    }
}

export function blogMapping(blog: any) {
    const blogMongoId = blog._id.toString();
    delete blog._id;

    return {
        id: blogMongoId,
        ...blog
    }
}

export function skipPages(pageNumber: number, pageSize: number) {
    return (+pageNumber - 1) * (+pageSize);

}

export const countTotalPostsAndPagesOfBlog = async (id: string, queryData: queryDataType) => {

    let postsTotalCount = await blogQueryRepository.getAllPostCountOfBlog(id);
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);

    return {
        postsTotalCount,
        postsPagesCount,
    }
}
export const countTotalBlogsAndPages = async (queryData: queryDataType, filter: any) => {

    let blogsTotalCount = await blogQueryRepository.getAllBlogsCount(filter);
    let blogsPagesCount = Math.ceil(blogsTotalCount / queryData.pageSize);

    return {
        blogsTotalCount,
        blogsPagesCount,
    }
}
export const countTotalPostsAndPages = async (queryData: queryDataType) => {

    let postsTotalCount = await blogQueryRepository.getAllPostsCount();
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);

    return {
        postsTotalCount,
        postsPagesCount,
    }
}
export const countTotalUsersAndPages = async (queryData: queryDataType, filter?: any) => {

    let usersTotalCount = await usersQueryRepository.getAllUsersCount(filter);
    let usersPagesCount = Math.ceil(usersTotalCount / queryData.pageSize);

    return {
        usersTotalCount,
        usersPagesCount,
    }
}

export function postMapping(post: any): PostViewModel {
    const postMongoId = post._id.toString();
    delete post._id;

    return {
        id: postMongoId,
        ...post,
    }
}

export function usersMapping(user: any) {
    const userMongoId = user._id.toString();

    return {
        id: userMongoId,
        login: user.userName,
        email: user.email,
        createdAt: user.createdAt.toISOString()
    }
}