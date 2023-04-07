import {Request, Response, Router} from 'express';
import {queryValidation} from '../validation/query-validation';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {usersQueryRepository} from '../repositories/user/user-query-repository';
import {userService} from '../domain/users-service';
import {basicAuthMiddleware} from '../validation/authorization';

export const usersRouter = Router({})


usersRouter.get('/',
    queryValidation,
    async (req: Request, res: Response) => {

        let queryData: queryDataType = await getDataFromQuery(req.query)
        const allUsers = await usersQueryRepository.getAllUsers(queryData);
        return res.send(allUsers)
    })

usersRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await userService.deleteUser(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })


usersRouter.post('/',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const newUser = await userService.createUser(req.body.login, req.body.email, req.body.password);
        return res.status(201).send(newUser)
    }
)