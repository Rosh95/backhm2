import {ObjectId} from 'mongodb';

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentsViewModel = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo
    createdAt: string

}
export type CommentsInputType = {
    content: string
}
export type CommentsDBType = {
    _id: ObjectId,
    content: string,
    userId: string
    userLogin: string
    createdAt: Date
}


export type PaginatorCommentViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentsViewModel[]
}