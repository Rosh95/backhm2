"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const videosData_1 = require("../videosData");
const videosValidation_1 = require("../validation/videosValidation");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get('/', (req, res) => {
    res.status(200).send(videosData_1.videoData);
});
exports.videosRouter.get('/:id', (req, res) => {
    let findVideo = videosData_1.videoData.find(m => m.id === +req.params.id);
    if (findVideo) {
        res.status(200).send(findVideo);
        return;
    }
    res.sendStatus(404);
});
exports.videosRouter.delete('/:id', (req, res) => {
    for (let i = 0; i < videosData_1.videoData.length; i++) {
        if (videosData_1.videoData[i].id === +req.params.id) {
            videosData_1.videoData.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.sendStatus(404);
});
exports.videosRouter.post('/', (req, res) => {
    let err = (0, videosValidation_1.newPostVideoValidate)(req.body);
    if (err.length > 0) {
        res.status(400).send({ errorsMessages: err });
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date(createdAt.getTime() + 86400000);
    let newVideo = {
        id: Date.now(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: req.body.availableResolutions
    };
    videosData_1.videoData.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videosRouter.put('/:id', (req, res) => {
    const err = (0, videosValidation_1.updatePostVideoValidate)(req.body);
    if (err.length > 0)
        return res.status(400).send({ errorsMessages: err });
    const video = videosData_1.videoData.find(m => m.id === +req.params.id);
    if (!video)
        return res.sendStatus(404);
    video.title = req.body.title;
    video.author = req.body.author;
    video.canBeDownloaded = req.body.canBeDownloaded;
    video.minAgeRestriction = req.body.minAgeRestriction;
    video.publicationDate = req.body.publicationDate;
    video.availableResolutions = req.body.availableResolutions;
    return res.sendStatus(204);
});
