import * as validate from "validate.js";
import * as httpError from "http-errors"
import {IUserModel} from "../models/userModel";
import {checkPassword} from './hash';
import {IFeedItemModel} from "../models/feedItemModel";

export const loginEmailValidator = (obj) => {
    const constraints = {
        email: {
            presence: {
                allowEmpty: false
            },
            email: {
                message: "'%{value}' is not a valid email"
            }
        },
        password: {
            presence: {
                allowEmpty: false
            },
            length: {
                minimum: 6,
                message: "must be at least 6 characters"
            }
        }
    };
    const res = validate(obj, constraints);
    if (typeof res !== 'undefined' && res) {
        throw new httpError.BadRequest(JSON.stringify(res));
    }
};

export const passwordValidator = (password, hashedPassword, salt) => {
    if (!checkPassword(password, hashedPassword, salt)) {
        throw new httpError.BadRequest('Wrong password.');
    }
};

export const mongoObjIdValidator = (id) => {
    const constraints = {
        id: {
            presence: {
                allowEmpty: false
            },
            format: {
                pattern: /^[0-9a-fA-F]{24}$/,
                message: (value) => {
                    return validate.format("^%{objectId} is not a valid Id", {
                        objectId: value
                    });
                }
            }
        }
    };
    const res = validate({id}, constraints);
    if (typeof res !== 'undefined' && res) {
        throw new httpError.BadRequest(JSON.stringify(res));
    }
};

export const languageValidator = (languageParameters, language) => {
    const lang = languageParameters[language];
    if (!lang)
        throw 'language not supported';
    return lang;
};

export const regionValidator = (regionParameters, region) => {
    const regParam = regionParameters[region];
    if (!regParam)
        throw 'region not supported';
    return regParam;
};

export const docCheckValidator = (doc: IUserModel | IFeedItemModel | null, throwWhenExists = false) => {
    if (doc && throwWhenExists) {
        throw new httpError.BadRequest('The email/media that you requested already registered in our database.');
    }
    if (!doc && !throwWhenExists) {
        throw new httpError.BadRequest('The user/media that you requested could not be found.');
    }
};

export const publicTokenDataValidator = (body) => {
    if (!body.language || !body.region) {
        throw new httpError.BadRequest('The body don\'t have the necessary info to get the token.');
    }
};

export const checkLanguageValidator = (body, supported) => {
    const findLang = supported.find(obj => (obj.language === body.language) && (obj.region === body.region));
    if (!findLang) {
        throw new httpError.BadRequest('The language and region requested are not supported.');
    }
};

export const requestType = (req) => {
    const contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0) {
        throw new httpError.BadRequest("Expects 'application/json'");
    }
};