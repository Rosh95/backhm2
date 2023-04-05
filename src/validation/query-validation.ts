import {query} from 'express-validator';


const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)
const pageNumberValidation1 = query('sortDirection').optional().custom((v, {req} ) => {
    v === 'asc' ? req.query!.sortDirection = 1 : req.query!.sortDirection = -1
    return true
})
// const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)
// const pageNumberValidation = query('pageNumber').optional().isInt({}).default(1)

export const queryValidation = [pageNumberValidation, pageNumberValidation ,pageNumberValidation]