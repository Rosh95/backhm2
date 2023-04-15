import e, {Request, Response, Router} from 'express';
import {queryValidation} from '../validation/query-validation';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {usersQueryRepository} from '../repositories/user/user-query-repository';
import {userService} from '../domain/users-service';
import {basicAuthMiddleware} from '../validation/authorization';
import {userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {PaginatorUserViewType, UserInputType, UsersDBType, UserViewModel} from '../types/user-types';

export const usersRouter = Router({})


usersRouter.get('/',
    queryValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response<PaginatorUserViewType>> => {

        try {
            const queryData: queryDataType = await getDataFromQuery(req.query)
            const allUsers: PaginatorUserViewType = await usersQueryRepository.getAllUsers(queryData);
            return res.send(allUsers)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })
usersRouter.get('/:userId',
    queryValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response<UserViewModel | null>> => {

        try {
            const user: UsersDBType | null = await userService.findUserById(req.params.userId)
            return res.send(user)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })

usersRouter.delete('/:id',
    basicAuthMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response<boolean>> => {
        try {
            const isDeleted: boolean = await userService.deleteUser(req.params.id)
            if (isDeleted) {
                return res.sendStatus(204)
            } else return res.sendStatus(404)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
)


usersRouter.post('/',
    basicAuthMiddleware,
    userValidation,
    errorsValidationMiddleware,
    async (req: Request, res: Response): Promise<e.Response<UserViewModel>> => {

        let userPostInputData: UserInputType = {
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        }
        const newUser: UserViewModel = await userService.createUser(userPostInputData);
        return res.status(201).send(newUser)
    }
)