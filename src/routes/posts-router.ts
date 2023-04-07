import {Request, Response, Router} from 'express';
import {blogIdMiddleware, postValidation} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {postQueryRepository} from '../repositories/post-query-repository';
import {postService} from '../domain/post-service';
import {queryValidation} from '../validation/query-validation';
import {blogRepository} from '../repositories/blog-repository';

export const postsRouter = Router({})

postsRouter.get('/',
    queryValidation,
    async (req: Request, res: Response) => {

        let queryData: queryDataType = await getDataFromQuery(req.query)
        const allPosts = await postQueryRepository.getAllPosts(queryData);
        return res.send(allPosts)
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
    postValidation,
    blogIdMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        let foundBlogName = await blogRepository.findBlogById(req.body.blogId)
        if (!foundBlogName) {
            return res.sendStatus(404);
        }

        const newPost = await postService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId ,foundBlogName);

        return res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postValidation,
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
