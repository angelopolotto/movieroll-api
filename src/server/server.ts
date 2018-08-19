import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

import {addStrategies} from "../middlewares/passportStrategies";
import {config} from "../config";

import {authRouter} from '../routes/auth';
import {userRouter} from '../routes/user';
import {favoritesRouter} from '../routes/favorites';
import {genresRouter} from '../routes/genres';
import {discoverRouter} from '../routes/discover';
import {checkApplicationType, errorHandler, notFoundHandler, notFoundRedirectHandler} from "../middlewares/utils";

const app = express();

addStrategies(passport);

const startServer = (done) => {
    // =======================
    // configuration =========
    // =======================
    const port = config.port; // used to create, sign, and verify tokens

    // use morgan to log requests to the console
    app.use(logger(config.env));

    // use body parser so we can get info from POST and/or URL parameters
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // enable cors to the server
    const corsOpt = {
        origin: config.cors_allow_origin.split(' '), // this work well to configure origin url in the server
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to work well with web app, OPTIONS is required
        allowedHeaders: ['Content-Type', 'Authorization'] // allow json and token in the headers
    };
    app.use(cors(corsOpt)); // cors for all the routes of the application
    app.options('*', cors(corsOpt)); // automatic cors gen for HTTP verbs in all routes, This can be redundant but I kept to be sure that work

    // =======================
    // start the server ======
    // =======================
    app.listen(port, async () => {
        // connect to database
        // mongoose.Promise = global.Promise;
        await mongoose.connect(config.db.uri, { useNewUrlParser: true });
        // const db = await mongoose.connection;

        // =======================
        // routes ================
        // =======================
        // serve the angular web page
        app.get('/', app.use(express.static(path.join(__dirname+'/../../public'))));

        const apiRoutes = express.Router();
        apiRoutes.use(`/auth`, authRouter);
        apiRoutes.use(`/user`, passport.authenticate('user-jwt', {session: false}), userRouter);
        apiRoutes.use(`/favorites`, passport.authenticate('user-jwt', {session: false}), favoritesRouter);
        apiRoutes.use(`/genres`, passport.authenticate('public-jwt', {session: false}), genresRouter);
        apiRoutes.use(`/discover`, passport.authenticate('public-jwt', {session: false}), discoverRouter);

        app.use(`/${config.api_name}/${config.api_version}`, checkApplicationType, apiRoutes);

        app.use(notFoundRedirectHandler);
        app.use(notFoundHandler);
        app.use(errorHandler);

        console.log(`listening at port: ${port}`);
        done(app);
    });
};

export {startServer};