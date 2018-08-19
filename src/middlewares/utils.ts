import * as httpError from "http-errors"
import {GenericResponse} from "../interfaces/response";
import {requestType} from "../utils/validators";

export const ok = (res, message) => {
    res.status(200).send(message);
};

export const created = (res, message) => {
    res.status(201).send(message);
};

export const badRequest = () => {
    throw new httpError.BadRequest('Missing data in the body');
};

export const asyncErrorWrap = (genFn) => {
    //catch exception express asynchronous call
    //https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
    return function (req, res, next) {
        genFn(req, res, next).catch(next);
    };
};

// handle SPA route redirect problem
export const notFoundRedirectHandler = (req, res, next) => {
    res.redirect('/');
    next();
};

export const notFoundHandler = (req, res, next) => {
    next(GenericResponse({status: 404, message: 'Not Found'}));
};

export const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json(GenericResponse({status: err.status, message: err.message}));
    next();
};

export const checkApplicationType = (req, res, next) => {
    requestType(req);
    next();
};