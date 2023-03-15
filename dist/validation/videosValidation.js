"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostVideoValidate = exports.newPostVideoValidate = void 0;
const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
function contains(what, where) {
    for (let i = 0; i < what.length; i++) {
        if (where.indexOf(what[i]) == -1)
            return false;
    }
    return true;
}
const newPostVideoValidate = (req) => {
    let errorsMessages = [];
    if (!req.title || !req.title.trim() || req.title.length > 40) {
        errorsMessages.push({
            message: 'Title should be less then 40 symbols',
            field: 'title'
        });
    }
    if (!req.author || !req.author.trim() || req.author.length > 20) {
        errorsMessages.push({
            message: 'Author should be less then 40 symbols',
            field: 'author'
        });
    }
    if (!req.availableResolutions || req.availableResolutions.length === 0 || !(contains(req.availableResolutions, availableResolutions))) {
        errorsMessages.push({
            message: `AvailableResolutions should be one of ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] `,
            field: 'availableResolutions'
        });
    }
    return errorsMessages;
};
exports.newPostVideoValidate = newPostVideoValidate;
const updatePostVideoValidate = (req) => {
    let errorsMessages = [];
    if (req.title === null || typeof req.title !== 'string' || !req.title || !req.title.trim() || req.title.length > 40) {
        errorsMessages.push({
            message: 'Title should be string and less then 40 symbols',
            field: 'title'
        });
    }
    if (typeof req.author !== 'string' || !req.author || !req.author.trim() || req.author.length > 20) {
        errorsMessages.push({
            message: 'Author should be less then 20 symbols',
            field: 'author'
        });
    }
    if (!req.availableResolutions || req.availableResolutions.length === 0 || !(contains(req.availableResolutions, availableResolutions))) {
        errorsMessages.push({
            message: `AvailableResolutions should be one of ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] `,
            field: 'availableResolutions'
        });
    }
    if (req.canBeDownloaded) {
        typeof req.canBeDownloaded === 'boolean' ?
            req.canBeDownloaded :
            errorsMessages.push({
                message: `canBeDownloaded should be boolean `,
                field: 'canBeDownloaded'
            });
    }
    if (!req.minAgeRestriction || req.minAgeRestriction < 1 || req.minAgeRestriction > 18) {
        errorsMessages.push({
            message: `Min Age Restriction should more than 1 and less then 18 or null`,
            field: 'minAgeRestriction'
        });
    }
    if (!req.publicationDate || typeof req.publicationDate !== 'string' || !req.publicationDate.trim()) {
        errorsMessages.push({
            message: `Publication Date should string`,
            field: 'publicationDate'
        });
    }
    return errorsMessages;
};
exports.updatePostVideoValidate = updatePostVideoValidate;
