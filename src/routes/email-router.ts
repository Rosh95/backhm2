import {Router} from 'express';

const nodemailer = require('nodemailer');


export const emailRouter = Router({});


emailRouter.post('/send',
    async (req, res) => {

        // let mailTransporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: 'azi.rosh95@gmail.com', // generated ethereal user
        //         pass: 'wkfuoxqawsjdgxkv', // generated ethereal password
        //     },
        // });
        //
        // let mailDetails = await mailTransporter.sendMail({
        //     from: 'Rosh1995 <azi.rosh95@gmail.com>',
        //     to: req.body.email,
        //     subject: req.body.subject,
        //     html: req.body.message
        // })
        // console.log(mailDetails)


        // mailTransporter.sendMail(mailDetails, function (err, data) {
        //     if (err) {
        //         console.log('Error Occurs');
        //     } else {
        //         console.log('Email sent successfully');
        //     }
        // });
        res.send({
            email: req.body.email,
            message: req.body.message,
            subject: req.body.subject
        })


    }
)