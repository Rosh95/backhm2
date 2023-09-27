"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidation = void 0;
const express_validator_1 = require("express-validator");
const pageNumberValidation = (0, express_validator_1.query)('pageNumber').optional().isInt({}).default(1);
const pageSizeValidation = (0, express_validator_1.query)('pageSize').optional().isInt({}).default(10);
const sortDirectionValidation = (0, express_validator_1.query)('sortDirection').optional().custom((v, { req }) => {
    v === 'asc' ? req.query.sortDirection = 1 : req.query.sortDirection = -1;
    return true;
});
const sortByValidation = (0, express_validator_1.query)('sortBy').optional().custom((v, { req }) => {
    v === req.query.sortBy ? (req.query.sortBy).toString() : 'createdAt';
    return true;
});
exports.queryValidation = [pageNumberValidation, sortDirectionValidation, pageSizeValidation, sortByValidation];
