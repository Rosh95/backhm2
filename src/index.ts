import {app} from './app';
import {testRouter} from './routes/testing-router';

const port = process.env.port || 3000;

app.use('/testing/all-data', testRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})