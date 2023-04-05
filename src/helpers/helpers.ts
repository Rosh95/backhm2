import {Request} from 'express';
import {SortDirection} from 'mongodb';
import {blogQueryRepository} from '../repositories/blog-query-repository';
import exp from 'constants';

export  type  queryDataType = {
    pageNumber: number,
    pageSize: number,
    sortByProp: string,
    sortDirection: SortDirection,
    searchName: string,
    skippedPages: number
}
export const getDataFromQuery = (query: any): queryDataType => {
// export const getDataFromQuery = (req: Request): queryDataType => {
    // const pageNumberFromQuery: any = req.query.pageNumber
    // const pageNumber = parseInt(pageNumberFromQuery, 10)
    // if (pageNumber)
    let pageNumber: number = query.pageNumber ? +query.pageNumber : 1; // NaN
    let pageSize: number = query.pageSize ? +query.pageSize : 10; // NaN
    let sortByProp: string = query.sortBy ? (query.sortBy).toString() : 'createdAt';
    let sortDirection: SortDirection = query.sortDirection === 'asc' ? 1 : -1;
    let searchName = query.searchName ? query.searchName : '';
    let skippedPages: number = skipPages(pageNumber, pageSize);


    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection,
        searchName,
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
    let result = (+pageNumber - 1) * (+pageSize);
    return result;
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

export function postMapping(post: any) {
    const postMongoId = post._id.toString();
    delete post._id;

    return {
        id: postMongoId,
        ...post,
        createdAt: post.createdAt.toISOString()
    }
}