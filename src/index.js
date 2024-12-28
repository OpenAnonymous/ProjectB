import express from 'express';
import { STORAGE_DIR , VIEWS_DIR ,STYLES_DIR } from './config/constant';
import route from './routers/index';
import { errorHandler } from './utils/handlers/error.handle';
import bodyParser from 'body-parser';
import cors from "cors"
import { limiter } from './config/rateLimitRequest';
import { APP_URL_CLIENT } from './config/constant';


var corsOptions = {
    origin: APP_URL_CLIENT,
    optionsSuccessStatus: 200
}
export const createApp = () =>{
    const app = express();

    app.set("views",VIEWS_DIR);
    app.set('view engine', 'ejs');
    app.use(express.static(STYLES_DIR));
    
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use('/static',express.static(STORAGE_DIR))
    app.use(bodyParser.json())  // for parsing application/json content-type
    app.use(bodyParser.urlencoded({ extended: false }))
    app.get('/', (req, res) =>{
        res.write("<h1>hello express</h1>");
        res.end();
    });
    route(app);
    app.use(errorHandler);
    return app;
};
