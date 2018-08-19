import {config} from "../config";
import * as MovieDb from 'moviedb-promise'
import {MediaType} from "../interfaces/feedItem";
import {FeedItemModel} from '../models/feedItemModel';
import {ITokenPlayload} from "../interfaces/token";
import {movieObjFactory, tvObjFactory} from "./factories";
import {IGenre} from "../interfaces/genre";

const moviedb = new MovieDb(config.tmdb_token);

export const getCachedFeed = async (tokenPayload: ITokenPlayload, item, media_type: MediaType, genres: IGenre[]) => {
    const doc = await FeedItemModel.findOne({id: item.id,
        language: tokenPayload.language,
        region: tokenPayload.region,
        media_type});
    if(!doc) {
        let feedObj;
        if (media_type === MediaType.tv) {
            const tvDetails = await moviedb.tvInfo({
                id: item.id,
                append_to_response: 'videos',
                language: tokenPayload.language
            });
            feedObj = tvObjFactory(item, tokenPayload, tvDetails, genres);
        } else if (media_type === MediaType.movie) {
            // append_to_response: 'recommendations,similar,credits,videos',
            const movieDetails = await moviedb.movieInfo({
                id: item.id,
                append_to_response: 'videos',
                language: tokenPayload.language
            });
            feedObj = movieObjFactory(item, tokenPayload, movieDetails, genres)
        }
        const genresModelNew = new FeedItemModel(feedObj);
        return await genresModelNew.save();
    } else {
        return doc;
    }
};