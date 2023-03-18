"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const testing_router_1 = require("./routes/testing-router");
const port = process.env.port || 3000;
app_1.app.use('/testing/all-data', testing_router_1.testRouter);
app_1.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
