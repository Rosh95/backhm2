import {ObjectId, SortDirection} from 'mongodb';
import {blogQueryRepository} from '../repositories/blog/blog-query-repository';
import {usersQueryRepository} from '../repositories/user/user-query-repository';
import {PostDBModel, PostViewModel} from '../types/post-types';
import {UsersDBType} from '../types/user-types';
import {CommentatorInfo, CommentsDBType, CommentsViewModel} from '../types/comments-types';
import {commentQueryRepository} from '../repositories/comment/comment-query-repository';
import {BlogDbType, BlogViewType} from '../types/blog-types';

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

    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1; // NaN
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

export function blogMapping(blog: BlogDbType): BlogViewType {
    const blogMongoId = blog._id.toString();

    return {
        id: blogMongoId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
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
export const countTotalCommentsAndPages = async (queryData: queryDataType, filter: any) => {

    let commentsTotalCount = await commentQueryRepository.getAllCommentsWithFilter(filter);
    let commentsPagesCount = Math.ceil(commentsTotalCount / queryData.pageSize);

    return {
        commentsTotalCount,
        commentsPagesCount,
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

export function postMapping(post: PostDBModel): PostViewModel {
    const postMongoId = post._id.toString();

    return {
        id: postMongoId,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString()
    }
}

export function usersMapping(user: UsersDBType) {
    const userMongoId = user._id.toString();

    return {
        id: userMongoId,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString()
    }
}

export function commentsMapping(comment: CommentsDBType): CommentsViewModel {
    const commentMongoId = comment._id.toString();

    return {
        id: commentMongoId,
        content: comment.content,
        commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin
        },
        createdAt: comment.createdAt.toISOString()
    }
}