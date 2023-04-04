export let db: dbType = {
    posts: [
        //{
        //     id: '1',
        //     title: 'Money',
        //     shortDescription: 'How to make money?',
        //     content: 'Just born in Billionare family',
        //     blogId: '1',
        //     blogName: 'finance',
        //     createdAt: '2023-03-30T20:41:53.971Z'
        // }, {
        //     id: '2',
        //     title: 'Women',
        //     shortDescription: 'How to sleep with 1000 women?',
        //     content: 'Just born in Billionare family',
        //     blogId: '1',
        //     blogName: 'women',
        //     createdAt: '2023-03-30T20:41:53.971Z'
        // },
        // {
        //     id: '3',
        //     title: 'Sport',
        //     shortDescription: 'How to be Fit?',
        //     content: 'Just go to fu**cking gym and eat healthy men',
        //     blogId: '2',
        //     blogName: 'sport',
        //     createdAt: '2023-03-30T20:41:53.971Z',
        //
        // }
    ],
    blogs: [
        {
            id: '1',
            name: 'Rosh',
            description: 'Awesome math tutor',
            websiteUrl: 'https://vk.com',
            createdAt: '2023-03-30T20:41:53.971Z',
            isMembership: false
        }, {
            id: '2',
            name: 'Gera',
            description: 'Awesome marketing',
            websiteUrl: 'https://twitter.com',
            createdAt: '2023-03-30T20:41:53.971Z',
            isMembership: false
        }]
}
export type dbType = {
    posts: Array<postType>,
    blogs: Array<blogType>
}

export type blogType = {
    id?: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean

}
export type blogInputType = {
    name: string,
    description: string,
    websiteUrl: string

}
export type postType = {
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string | null,
    createdAt?: Date

}
export type postInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}
