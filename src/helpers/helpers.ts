import {Request} from 'express';
import {SortDirection} from 'mongodb';
import {blogQueryRepository} from '../repositories/blog-query-repository';
import exp from 'constants';

export  type  queryDataType = {
    pageNumber: number,
    pageSize: number,
    sortByProp: string,
    sortDirection: SortDirection,
    skippedPages: number
}
export const getDataFromQuery = (req: Request): queryDataType => {
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    let sortByProp: string = req.query.sortBy ? (req.query.sortBy).toString() : 'createdAt';
    let sortDirection: SortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
    let skippedPages: number = skipPages(pageNumber, pageSize);


    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection,
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

export const countTotalPostsAndPagesOfBlog = async (req: Request, queryData: queryDataType) => {

    let postsTotalCount = await blogQueryRepository.getAllPostCountOfBlog(req.params.id);
    let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);

    return {
        postsTotalCount,
        postsPagesCount,
    }
}
export const countTotalBlogsAndPages = async (req: Request, queryData: queryDataType) => {

    let blogsTotalCount = await blogQueryRepository.getAllBlogsCount();
    let blogsPagesCount = Math.ceil(blogsTotalCount / queryData.pageSize);

    return {
        blogsTotalCount,
        blogsPagesCount,
    }
}
