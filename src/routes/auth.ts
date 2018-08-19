import * as express from 'express';
import {languages} from "../languages/supported";
import {asyncErrorWrap, created, ok} from "../middlewares/utils";
import {
    checkLanguageValidator,
    docCheckValidator,
    loginEmailValidator,
    passwordValidator,
    publicTokenDataValidator
} from "../utils/validators";
import {UserModel} from "../models/userModel";
import {Roles, UserFactory} from "../interfaces/user";
import {getToken, refreshOrGenerateToken} from "../utils/jwt";
import {TokenPayload} from "../interfaces/token";
import {hashPassword} from "../utils/hash";
const authRouter = express.Router();

const register = async (req, res) => {
    const userData = req.body || {};
    //check if email exists before add
    const doc = await UserModel.findOne({email: userData.email});
    docCheckValidator(doc, true);
    const hashObj = hashPassword(userData.password);
    userData.passwordHash = hashObj.passwordHash;
    userData.salt = hashObj.salt;
    const userModelNew = new UserModel(userData);
    const docSave = await userModelNew.save();
    created(res, UserFactory.userProfile(docSave));
};

const login = async (req, res) => {
    let data = req.body;
    const email = data.email;
    const password = data.password;
    loginEmailValidator(data);
    const doc = await UserModel.findOne({email});
    docCheckValidator(doc);
    passwordValidator(password, doc.passwordHash, doc.salt);
    ok(res, UserFactory.userProfile(doc));
};

const refreshToken = async (req, res) => {
    //get token from body
    const tokenReceived = req.body.token || {};
    //get decoded token and the new token created
    const {decodedToken, newToken} = refreshOrGenerateToken(tokenReceived);
    //check if user exists
    const doc = await UserModel.findOne({username: decodedToken.username});
    docCheckValidator(doc);
    //return new token
    ok(res, {token: newToken});
};

const generatePublicAccessToken = async (req, res) => {
    //check language and region from body
    publicTokenDataValidator(req.body);
    //check if the language and region are supported
    checkLanguageValidator(req.body, languages);
    //generate the token
    const publicToken = getToken(TokenPayload(
        {
            user_id: '',
            language: req.body.language,
            region: req.body.region,
            role: Roles.PUBLIC
        })
    );
    ok(res, {token: publicToken});
};

const supportedLanguages = (req, res) => {
    ok(res, languages);
};

/**
 * Auth routes
 */
authRouter.post('/register', asyncErrorWrap(register));
authRouter.post('/login', asyncErrorWrap(login));
authRouter.post('/refreshToken', asyncErrorWrap(refreshToken));
authRouter.post('/publicToken', asyncErrorWrap(generatePublicAccessToken));
authRouter.get('/languages', supportedLanguages);

export {authRouter};
