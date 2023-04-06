import {SortDirection} from 'mongodb';
import {blogQueryRepository} from '../repositories/blog-query-repository';

export  type  queryDataType = {
    pageNumber: number,
    pageSize: number,
    sortByProp: string,
    sortDirection: SortDirection,
    searchNameTerm?: string,
    skippedPages: number
}
export const getDataFromQuery = async (query: any): Promise<queryDataType> => {
// export const getDataFromQuery = (req: Request): queryDataType => {
    // const pageNumberFromQuery: any = req.query.pageNumber
    // const pageNumber = parseInt(pageNumberFromQuery, 10)
    // if (pageNumber)
    let pageNumber: number = query.pageNumber ? +query.pageNumber : 1; // NaN
    let pageSize: number = query.pageSize ? +query.pageSize : 10; // NaN
    let sortByProp: string = query.sortBy ? (query.sortBy).toString() : 'createdAt';
    let sortDirection: SortDirection = query.sortDirection === 'asc' ? 1 : -1;
    let searchNameTerm = query.searchNameTerm ? query.searchNameTerm : '';
    let skippedPages: number = skipPages(pageNumber, pageSize);

    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection,
        searchNameTerm,
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

export function postMapping(post: any) {
    const postMongoId = post._id.toString();
    delete post._id;

    return {
        id: postMongoId,
        ...post,
        createdAt: post.createdAt.toISOString()
    }
}