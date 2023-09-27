"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = require("express");
const nodemailer = require('nodemailer');
exports.emailRouter = (0, express_1.Router)({});
exports.emailRouter.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
}));
