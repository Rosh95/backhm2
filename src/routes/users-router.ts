import {Request, Response, Router} from 'express';
import {queryValidation} from '../validation/query-validation';
import {getDataFromQuery, queryDataType} from '../helpers/helpers';
import {usersQueryRepository} from '../repositories/user/user-query-repository';
import {userService} from '../domain/users-service';
import {basicAuthMiddleware} from '../validation/authorization';
import {userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {getUserViewModel, NewUsersDBType, PaginatorUserViewType, UserInputType} from '../types/user-types';

export const usersRouter = Router({})

export class UsersController {
    async getUsers(req: Request, res: Response) {
        try {
            const queryData: queryDataType = await getDataFromQuery(req.query)
            const allUsers: PaginatorUserViewType = await usersQueryRepository.getAllUsers(queryData);
            return res.send(allUsers)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user: NewUsersDBType | null = await userService.findUserById(req.params.userId)
            return res.send(user)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    async deleteUserById(req: Request, res: Response) {
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

    async createUser(req: Request, res: Response) {
        let userPostInputData: UserInputType = {
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        }
        const newUser: getUserViewModel | null = await userService.createUser(userPostInputData);
        // await userService.createUser(userPostInputData);
        return res.status(201).send(newUser)
    }
}

export const usersController = new UsersController()

usersRouter.get('/',
    queryValidation,
    errorsValidationMiddleware, usersController.getUsers.bind(usersController))
usersRouter.get('/:userId',
    queryValidation,
    errorsValidationMiddleware, usersController.getUserById.bind(usersController))

usersRouter.delete('/:id',
    basicAuthMiddleware,
    errorsValidationMiddleware, usersController.deleteUserById.bind(usersController))


usersRouter.post('/',
    basicAuthMiddleware,
    userValidation,
    errorsValidationMiddleware, usersController.createUser.bind(usersController))