import {app} from './app';
import {runDb} from './db/dbMongo';

const port = process.env.port || 3001;

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}

startApp()