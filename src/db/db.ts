export let db: dbType = {
    posts: [
        {
            id: '1',
            title: 'Money',
            shortDescription: 'How to make money?',
            content: 'Just born in Billionare family',
            blogId: '1',
            blogName: 'finance'
        }, {
            id: '2',
            title: 'Women',
            shortDescription: 'How to sleep with 1000 women?',
            content: 'Just born in Billionare family',
            blogId: '1',
            blogName: 'women'
        },
        {
            id: '3',
            title: 'Sport',
            shortDescription: 'How to be Fit?',
            content: 'Just go to fu**cking gym and eat healthy men',
            blogId: '2',
            blogName: 'sport'
        }
    ],
    blogs: [
        {
            id: '1',
            name: 'Rosh',
            description: 'Awesome math tutor',
            websiteUrl: 'vk.com',
        }, {
            id: '2',
            name: 'Gera',
            description: 'Awesome marketing',
            websiteUrl: 'twitter.com',
        }]
}
export type dbType = {
    posts: Array<postType>,
    blogs: Array<blogType>
}

export type blogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string

}
export type blogInputType = {
    name: string,
    description: string,
    websiteUrl: string

}
export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}
export type postInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}
