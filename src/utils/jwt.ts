import * as jwt from 'jsonwebtoken';
import {config} from '../config';
import {ITokenPlayload, TokenPayload} from "../interfaces/token";

export const getToken = (payload: ITokenPlayload): string => {
    return jwt.sign(payload, config.jwt_private_key, { expiresIn: config.jwt_expiration });
};

export const refreshOrGenerateToken = (token: string) => {
    //veirify if expired token is valid
    const decodedToken: any = jwt.verify(token, config.jwt_private_key, {ignoreExpiration: true});
    //check if it is expired
    const dateNow = new Date();
    if(decodedToken.exp < dateNow.getTime()){
        //it is expired, return a new token
        const newToken = getToken(TokenPayload({
            user_id: decodedToken.user_id,
            language: decodedToken.language,
            region: decodedToken.region,
            role: decodedToken.role
        }));
        return {decodedToken, newToken}
    }
    //else return the same token
    return {decodedToken, token};
};

export const verifyToken = (token: string): ITokenPlayload => {
    return jwt.verify(token, config.jwt_private_key) as ITokenPlayload;
};

export const fromHeaderOrQuerystring = (req): string => {
    // from Header Or Querystring
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    throw "Expects 'Authorization Bearer TOKEN' header or '?token=' request query";
};

export const getAndVerifyToken = (req): ITokenPlayload => {
    return verifyToken(fromHeaderOrQuerystring(req));
};