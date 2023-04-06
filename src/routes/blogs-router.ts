import e, {Request, Response, Router} from 'express';
import {
    descriptionBlogMiddleware,
    nameBlogMiddleware,
    websiteUrlBlogMiddleware
} from '../validation/blogs-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {blogService} from '../domain/blog-service';
import {blogRepository} from '../repositories/blog-repository';
import {
    contentPostMiddleware,
    shortDescriptionPostMiddleware,
    titlePostMiddleware
} from '../validation/posts-validation-middleware';
import {blogQueryRepository} from '../repositories/blog-query-repository';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response): Promise<e.Response<any, Record<string, any>>> => {

    let queryData: queryDataType = await getDataFromQuery(req.query)
    const allBlogs = await blogQueryRepository.getAllBlogs(queryData);
    return res.send(allBlogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundBlog = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
        return;
    }
    res.sendStatus(404)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await blogService.deleteBlog(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

blogsRouter.post('/',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    websiteUrlBlogMiddleware,
    nameBlogMiddleware,
    descriptionBlogMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        let foundBlog = await blogService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        if (foundBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


blogsRouter.get('/:id/posts',
    async (req: Request, res: Response) => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {
            let queryData: queryDataType = await getDataFromQuery(req.query)
            let foundPosts = await blogQueryRepository.getAllPostOfBlog(req.params.id, queryData);
            //let pagesCount = await countTotalPostsAndPagesOfBlog(req, queryData);
            // let postsTotalCount = await blogQueryRepository.getAllPostCount(req.params.id);
            // let postsPagesCount = Math.ceil(postsTotalCount / queryData.pageSize);

            // const result = {
            //     pagesCount: pagesCount.postsPagesCount,
            //     page: queryData.pageNumber,
            //     pageSize: queryData.pageSize,
            //     totalCount: pagesCount.postsTotalCount,
            //     items: foundBlogs
            //
            // }
            // if (foundBlogs) {
            //     res.send(result)
            //     return;
            // }
            // res.sendStatus(404)

            return res.send(foundPosts);

        } catch (e) {
            return res.status(500).json(e)
        }
    })

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let isExistBlog = await blogRepository.findBlogById(req.params.id);
        if (!isExistBlog) {
            return res.sendStatus(404)
        }
        try {
          //  const newPost = await postRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

            const newPost = await blogQueryRepository.createPostForExistingBlog(req.params.id, req.body.title, req.body.shortDescription, req.body.content);

            return res.status(201).send(newPost)
        } catch (e) {
            return res.status(500).json(e)
        }

    })