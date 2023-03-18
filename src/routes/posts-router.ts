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

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postRepository.findPosts();
    res.send(posts)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    let foundPost = postRepository.findPostById(+req.params.id)
    if (foundPost) {
        res.send(foundPost)
        return;
    }
    res.sendStatus(404)
})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    (req: Request, res: Response) => {

        const isDeleted = postRepository.deletePost(+req.params.id)

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
    (req: Request, res: Response) => {
        const newPost = postRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName);

        res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    titlePostMiddleware,
    shortDescriptionPostMiddleware,
    contentPostMiddleware,
    blogIdMiddleware,
    errorsPostMiddleware,
    (req: Request, res: Response) => {
        let uodatedPost = postRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName );
        if (uodatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
