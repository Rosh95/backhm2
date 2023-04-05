import {BlogViewType} from './blog-types';

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string | null,
    createdAt?: Date

}
export type postInputType = {
    id?: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date
}


export type PaginatorPostViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}