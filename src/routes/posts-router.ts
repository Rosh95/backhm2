import {Request, Response, Router} from 'express';
import {postRepository} from '../repositories/post-repository';
import {
    blogIdMiddleware,
    contentPostMiddleware, errorsPostMiddleware,
    shortDescriptionPostMiddleware,
    titlePostMiddleware
} from '../validation/posts-validation-middleware';
import {basicAuthMiddleware} from '../validation/authorization';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postRepository.findPosts();
    res.send(posts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundPost = await postRepository.findPostById(+req.params.id)
    if (foundPost) {
        res.send(foundPost)
        return;
    }
    res.sendStatus(404)
})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await postRepository.deletePost(+req.params.id)

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
    errorsPostMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    blogIdMiddleware,
    errorsPostMiddleware,
    async (req: Request, res: Response) => {
        let updatedPost = await postRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        if (updatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
