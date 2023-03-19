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
exports.errorsPostMiddleware = exports.blogIdMiddleware = exports.contentPostMiddleware = exports.shortDescriptionPostMiddleware = exports.titlePostMiddleware = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
const dbMongo_1 = require("../db/dbMongo");
exports.titlePostMiddleware = (0, express_validator_1.body)('title').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('title should be less than 30 symbols string');
exports.shortDescriptionPostMiddleware = (0, express_validator_1.body)('shortDescription').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage('shortDescription should be less than 500 symbols string');
exports.contentPostMiddleware = (0, express_validator_1.body)('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage('content should be less than 1000 symbols string');
let blogsIdArray = db_1.db.blogs.map(b => b.id);
console.log(blogsIdArray);
exports.blogIdMiddleware = (0, express_validator_1.body)('blogId').isString().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(value);
    console.log(`${blogsIdArray} exists blogID`);
    //   const isIncluded = db.blogs.map(b => b.id).includes(value);
    const isIncluded = yield dbMongo_1.blogsCollection.find({ id: value }).toArray();
    if (isIncluded.length === 0) {
        // return false;
        throw new Error('This blogId doesn`t exist');
    }
    return true;
})).withMessage('Please, write exist blogId');
const errorsPostMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array({ onlyFirstError: true }).map((e) => {
                return {
                    message: e.msg,
                    field: e.param
                };
            })
        });
    }
    else {
        next();
    }
};
exports.errorsPostMiddleware = errorsPostMiddleware;
