import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';

export const errorsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array({onlyFirstError: true}).map((e) => {
                    return {
                        message: e.msg,
                        field: e.param
                    }
                }
            )
        })
    } else {
        next()
    }
}