import {ObjectId} from 'mongodb';

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string

}
export type UserInputType = {
    id: string
    login: string,
    password: string,
    email: string,
}
export type UsersDBType = {
    _id: ObjectId,
    userName: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date
}


export type PaginatorUserViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}