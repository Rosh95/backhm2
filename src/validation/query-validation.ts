import {query} from 'express-validator';


const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)
const pageSizeValidation = query('pageSize').optional().isInt({}).default(10)
const sortDirectionValidation = query('sortDirection').optional().custom((v, {req} ) => {
    v === 'asc' ? req.query!.sortDirection = 1 : req.query!.sortDirection = -1
    return true
})
const sortByPropValidation = query('sortBy').optional().custom((v, {req} ) => {
    v === req.query!.sortBy ? (req.query!.sortBy).toString() : 'createdAt';
    return true
})

// const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)
// const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)

export const queryValidation = [pageNumberValidation, sortDirectionValidation ,pageSizeValidation, sortByPropValidation]