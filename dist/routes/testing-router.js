"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const videosData_1 = require("../videosData");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/testing/all-data', (req, res) => {
    if (videosData_1.videoData.length > 0) {
        videosData_1.videoData.splice(0);
        res.sendStatus(204);
        return;
    }
});
