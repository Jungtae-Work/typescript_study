import express from 'express';
import path from 'node:path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import nunjucks from 'nunjucks';
import 'dotenv/config';

import webSocket from './socket';
import indexRouter from './routes';

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET as string,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use('/', indexRouter);

app.use((req:express.Request, res:express.Response, next: express.NextFunction) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.cause = 404;
    next(error);
});

app.use((err:Error, req:express.Request, res:express.Response, next:express.NextFunction ) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV != 'production' ? err : {};
    res.statusCode = err.cause as number || 500;
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

webSocket(server);
