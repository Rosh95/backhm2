import {ObjectId} from 'mongodb';

export type BlogPostInputModel = {
    title: string,
    shortDescription: string,
    content: string,

}
export type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean


}

export type BlogDbType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PaginatorBlogViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewType[]
}