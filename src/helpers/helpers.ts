import {Request} from 'express';
import {SortDirection} from 'mongodb';

export  type  queryDataType = {
    pageNumber: number,
    pageSize: number,
    sortByProp: string,
    sortDirection: SortDirection
}
export const getDataFromQuery = (req: Request): queryDataType => {
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    let sortByProp: string = req.query.sortBy ? (req.query.sortBy).toString() : 'createdAt';
    let sortDirection: SortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

    return {
        pageNumber,
        pageSize,
        sortByProp,
        sortDirection
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