import {Request, Response, Router} from 'express';
import {
    blogIdMiddleware,
    contentPostMiddleware,
    shortDescriptionPostMiddleware,
    titlePostMiddleware
} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {postQueryRepository} from '../repositories/post-query-repository';
import {postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';

export const postsRouter = Router({})

postsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response) => {

        // let queryData: queryDataType = getDataFromQuery(req)
        // const posts = await postService.findBlogs(queryData);
        // let pagesCount = await countTotalBlogsAndPages(req, queryData);
        let queryData: queryDataType = await getDataFromQuery(req.query)
        const allPosts = await postQueryRepository.getAllPosts(queryData);
        return res.send(allPosts)


        // let pageNumber = req.body.pageNumber ? req.body.pageNumber : '1';
        // let pageSize = req.body.pageSize ? req.body.pageSize : '10';
        // let sortByProp = req.body.sortBy ? req.body.sortBy : 'createdAt';
        // let sortDirection = req.body.sortDirection ? req.body.sortDirection : 'desc';
        //
        // const posts = await postRepository.findPosts();
        // let postsPagesCount = Math.ceil(+posts.length / +pageSize);
        // let postsTotalCount = +posts.length;
        //
        // const result = {
        //     pagesCount: postsPagesCount,
        //     page: pageNumber,
        //     pageSize: pageSize,
        //     totalCount: postsTotalCount,
        //     items: posts
        //
        // }
        // res.send(result)
    })

postsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundPost = await postService.findPostById(req.params.id)
    if (foundPost) {
        res.send(foundPost)
        return;
    }
    res.sendStatus(404)
})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await postService.deletePost(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

postsRouter.post('/',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let updatedPost = await postService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
        if (updatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
