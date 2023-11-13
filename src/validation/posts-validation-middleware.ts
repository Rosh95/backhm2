import {body, param} from 'express-validator';
import {BlogModel} from '../db/dbMongo';
import {ObjectId} from 'mongodb';

export const titlePostMiddleware = body('title').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('title should be less than 30 symbols string');
export const shortDescriptionPostMiddleware = body('shortDescription').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage('shortDescription should be less than 500 symbols string');

export const contentPostMiddleware = body('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage('content should be less than 1000 symbols string');

//let blogsIdArray = db.blogs.map((b: { id: any; }) => b.id);
//console.log(blogsIdArray)
export const blogIdMiddleware = body('blogId').isString().custom(async (value) => {
    console.log(value);
    //  console.log(`${blogsIdArray} exists blogID`)
    //   const isIncluded = db.blogs.map(b => b.id).includes(value);
    //  const isIncluded = await blogsCollection.find({id:value}).toArray();
    const isIncluded = await BlogModel.findById(value);
    if (!isIncluded) {
        // return false;
        throw new Error('This blogId doesn`t exist')
    }
    return true;

}).withMessage('Please, write exist blogId');
export const blogIdMiddlewareInParams = param('id').isString().custom(async (value) => {
    console.log(value);
    //   console.log(`${blogsIdArray} exists blogID`)
    //   const isIncluded = db.blogs.map(b => b.id).includes(value);
    //  const isIncluded = await blogsCollection.find({id:value}).toArray();
    const isIncluded = await BlogModel.findOne({_id: new ObjectId(value.toString())});
    if (!isIncluded) {
        // return false;
        throw new Error('This blogId doesn`t exist')
    }
    return true;

}).withMessage('Please, write exist blogId');


//export const postValidation = [titlePostMiddleware, shortDescriptionPostMiddleware, contentPostMiddleware, blogIdMiddleware ]
export const postValidation = [titlePostMiddleware, shortDescriptionPostMiddleware, contentPostMiddleware]
