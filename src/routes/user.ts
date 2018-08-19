import * as express from 'express';
import {docCheckValidator, mongoObjIdValidator} from "../utils/validators";
import {UserModel} from "../models/userModel";
import {UserFactory} from "../interfaces/user";
import {asyncErrorWrap, ok} from "../middlewares/utils";
import {GenericResponse} from "../interfaces/response";
const userRouter = express.Router();

export const get = async (req, res) => {
    const _id = req.params.user_id;
    mongoObjIdValidator(_id);
    const doc = await UserModel.findOne({_id});
    docCheckValidator(doc);
    ok(res, UserFactory.userProfile(doc, true));
};

export const update = async (req, res) => {
    const _id = req.params.user_id;
    const userObj = req.body || {};
    mongoObjIdValidator(_id);
    const doc = await UserModel.findOne({_id});
    docCheckValidator(doc);
    //if the email was changed, if it was changed, check if it is already exists in the base
    if (userObj.email !== doc.email) {
        //try find someone that have the same email
        const doc = await UserModel.findOne({email: userObj.email});
        //pass if the result is empty
        docCheckValidator(doc, true);
        //update the user with the new information
        const docUpdate = await UserModel.update({_id}, userObj);
        //check if everything is ok
        docCheckValidator(docUpdate);
    } else {
        //if the email is the same, just update the user
        const docUpdate = await UserModel.update({_id}, userObj);
        docCheckValidator(docUpdate);
    }
    //retrieve the user updated
    const docFindOne = await UserModel.findOne({_id});
    docCheckValidator(docFindOne);
    //return the user updated
    ok(res, UserFactory.userProfile(docFindOne));
};

export const deleteUser = async (req, res) => {
    const _id = req.params.user_id;
    mongoObjIdValidator(_id);
    //delete the user
    await UserModel.remove({_id});
    //return response
    ok(res, GenericResponse({message: 'deleted'}));
};

/**
 * User routes
 */
userRouter.get('/:user_id', asyncErrorWrap(get));
userRouter.put('/:user_id', asyncErrorWrap(update));
userRouter.delete('/:user_id', asyncErrorWrap(deleteUser));

export {userRouter};