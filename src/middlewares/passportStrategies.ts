import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import {UserModel} from '../models/userModel';
import {checkPassword} from '../utils/hash'
import {GenericResponse} from "../interfaces/response";
import {config} from "../config";
import {ITokenPlayload} from "../interfaces/token";
import {Roles} from "../interfaces/user";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export function addStrategies(passport) {
    // passport.use(new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'password'
    //     },
    //     function (email, password, cb) {
    //         UserModel.findOne({email})
    //             .then(user => {
    //                 if (!user) {
    //                     return cb(null, false, GenericResponse({message: 'Incorrect email or password.'}));
    //                 }
    //                 else if (checkPassword(password, user!.passwordHash, user!.salt)) {
    //                     return cb(null, user, GenericResponse({message: 'Logged In Successfully'}));
    //                 } else {
    //                     return cb(null, false, GenericResponse({message: 'Incorrect email or password.'}));
    //                 }
    //             })
    //             .catch(err => {
    //                 return cb(err);
    //             });
    //     }
    // ));

    passport.use('public-jwt', new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : config.jwt_private_key
        },
        function (jwtPayload: ITokenPlayload, cb) {
            if (jwtPayload.role !== Roles.PUBLIC) {
                return cb(null, false, GenericResponse({message: 'You can not access this endpoint with the current role'}));
            }
            return cb(null, jwtPayload);
        }
    ));

    passport.use('user-jwt', new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : config.jwt_private_key
        },
        function (jwtPayload: ITokenPlayload, cb) {
            if (jwtPayload.role !== Roles.USER) {
                return cb(null, false, GenericResponse({message: 'You can not access this endpoint with the current role'}));
            }
            return cb(null, jwtPayload);
        }
    ));
}