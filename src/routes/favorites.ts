import * as express from 'express';
import {asyncErrorWrap, ok} from "../middlewares/utils";
import {docCheckValidator} from "../utils/validators";
import {IUserModel, UserModel} from "../models/userModel";
import {FeedItemFactory} from "../interfaces/feedItem";
import {FeedItemModel, IFeedItemModel} from "../models/feedItemModel";
import {GenericResponse} from "../interfaces/response";
import {IUser} from "../interfaces/user";

const favoritesRouter = express.Router();

export const addToFavoriteList = async (req, res) => {
    const tokenPayload = req.user;
    const media_id = parseInt(req.params.media_id);
    const doc: IUserModel = await UserModel.findOne({_id: tokenPayload.user_id});
    docCheckValidator(doc);
    const docPopulated = await doc.populate('favorites').execPopulate();
    const filteredDoc = docPopulated.favorites.filter(e => e.media_id === media_id);
    if (filteredDoc.length <= 0) {
        const feedDoc: IFeedItemModel = await FeedItemModel.findOne({media_id: media_id});

        docCheckValidator(feedDoc);
        doc.favorites.push(feedDoc._id);
    }
    const docUpdate = await UserModel.update({_id: tokenPayload.user_id}, {$set: {favorites: doc.favorites}});
    docCheckValidator(docUpdate);
    ok(res, GenericResponse({message: 'added'}));
};

export const getFavoriteList = async (req, res) => {
    const tokenPayload = req.user;
    const doc = await UserModel.findOne({_id: tokenPayload.user_id}).populate('favorites').exec();
    docCheckValidator(doc);
    ok(res, doc.favorites);
};

export const getWatchedList = async (req, res) => {
    const tokenPayload = req.user;
    const doc = await UserModel.findOne({_id: tokenPayload.user_id}).populate('watched').exec();
    docCheckValidator(doc);
    ok(res, doc.watched);
};

export const removeFromFavoriteList = async (req, res) => {
    // get the parameters
    const media_id = parseInt(req.params.media_id);
    const tokenPayload = req.user;
    // get the correspondent user
    const doc = await UserModel.findOne({_id: tokenPayload.user_id});
    docCheckValidator(doc);
    // request the user with the favorites populated
    let docPopulated = await doc.populate('favorites').execPopulate();
    const docWatchPopulated = await doc.populate('watched').execPopulate();
    // check if favorites contain the item requested
    const itemFiltered = docPopulated.favorites.filter(e => e.media_id === media_id);
    if (itemFiltered !== null || itemFiltered.length > 0) {
        // if contain, remove from the list
        // find the index of the item
        const idx = docPopulated.favorites.indexOf(itemFiltered[0]);

        // ************ Watched list handle *************
        // remove item from the original obj not populated and push to watched list
        const deletedItem = doc.favorites.splice(idx, 1)[0];

        // check if item exist in the favorites list
        if (deletedItem) {
            // check if item not exists in the watched list
            const itemFilteredWatched = docWatchPopulated.watched.filter(e => {
                if (e !== null) {
                    return e.media_id === deletedItem.media_id;
                }
            });
            if (itemFilteredWatched === null || itemFilteredWatched.length === 0) {
                // add if item don't exists
                doc.watched.push(deletedItem);
            }
            // save changes in the database
            const docUpdate = await UserModel.update({_id: tokenPayload.user_id}, doc);
            // validate de response
            docCheckValidator(docUpdate);
        }
    }
    // return a message
    ok(res, GenericResponse({message: 'removed'}));
};

/**
 * Fav routes
 */
favoritesRouter.post('/:media_id', asyncErrorWrap(addToFavoriteList));
favoritesRouter.get('/', asyncErrorWrap(getFavoriteList));
favoritesRouter.get('/watched', asyncErrorWrap(getWatchedList));
favoritesRouter.delete('/:media_id', asyncErrorWrap(removeFromFavoriteList));

export {favoritesRouter};
