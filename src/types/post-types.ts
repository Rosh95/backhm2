export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string | null,
    createdAt?: string

}
export type postInputType = {
    id?: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}


export type PaginatorPostViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}