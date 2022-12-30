import config from "../config/config.js";
import routes from "../api/index.js";
import Logger from "./logger.js";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import MySQLStore from "express-mysql-session";
import session from "express-session";

import morgan from "morgan";
import nunjucks from "nunjucks";

const expressLoader = (app) => {

    /*
     * Health Check endpoints
     */
    app.get("/status", (req, res) => {
        res.status(200).end();
    });
    app.head("/status", (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable("trust proxy");

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // View template
    app.set('view engine', 'html');
    nunjucks.configure('src/views', {
        express: app,
        watch: true,
    });

    // log
    const httpLogStream = {
        write: (message) => { Logger.http(message); }
    };
    app.use(morgan("dev", { stream: httpLogStream }));

    // session options
    const options = {
        host: config.databaseURL,
        port: config.databasePort,
        user: config.databaseUser,
        password: config.databasePassword,
        database: config.databaseName
    };
    // session
    app.use(
        session({
            secret: config.cookieSecret,
            resave: false,
            saveUninitialized: true,
            store: new MySQLStore(options)
        })
    );

    // POST parameter read
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // cookie
    app.use(cookieParser(config.cookieSecret));

    // Load API routes
    app.use(config.api.prefix, routes());
    console.log(config.api.prefix);
    
    // 404 에러가 발생한 경우 처리
    app.use((req, res, next) => {
        const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
        err.status = 404;
        next(err);
    });

    // 모든 에러가 발생한 경우 처리
    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
        res.status(err.status || 500);
        res.render("error");
    });
};

export default expressLoader;