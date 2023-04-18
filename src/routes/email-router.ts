import {Router} from 'express';


export const emailRouter = Router({});


emailRouter.post('/send',
    async (req, res) => {
        res.send({
            email: req.body.email,
            message: req.body.message,
            subject: req.body.subject

        })
    }
)