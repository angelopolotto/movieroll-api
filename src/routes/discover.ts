import {config} from "../config";
import * as MovieDb from 'moviedb-promise';
import * as express from 'express';
import {asyncErrorWrap, ok} from "../middlewares/utils";
import {getGenresMovie, getGenresTv} from "../caches/genres";
import {MediaType} from "../interfaces/feedItem";
import {getCachedFeed} from "../caches/feed";
import {IFeedItem} from "../interfaces/feedItem";
import {IFeed} from "../interfaces/feed";

const discoverRouter = express.Router();
const moviedb = new MovieDb(config.tmdb_token);

const discoverMovie = async (req, res) => {
    const tokenPayload = req.user;
    const discoverMovieResults = await moviedb.discoverMovie({
        language: tokenPayload.language,
        region: tokenPayload.region,
        include_adult: false,
        with_genres: req.query.with_genres,
        include_video: true,
        page: req.query.page || 1
    });
    const genresMovie = await getGenresMovie(tokenPayload.language);
    let discoverMovieResp: IFeedItem[] = [];
    for(let i = 0; i < discoverMovieResults.results.length; i++) {
        const item = discoverMovieResults.results[i];
        const doc = await getCachedFeed(tokenPayload, item, MediaType.movie, genresMovie);
        discoverMovieResp.push(doc);
    }
    const feed: IFeed = {
        result: discoverMovieResp,
        page: discoverMovieResults.page,
        pages: discoverMovieResults.total_pages
    };
    ok(res, feed);
};

const discoverTv = async (req, res) => {
    const tokenPayload = req.user;
    const discoverTvResults = await moviedb.discoverTv({
        language: tokenPayload.language,
        region: tokenPayload.region,
        include_adult: false,
        with_genres: req.query.with_genres,
        include_video: true,
        page: req.query.page || 1
    });
    const genresTv = await getGenresTv(tokenPayload.language);
    let discoverTvResp = [];
    for(let i = 0; i < discoverTvResults.results.length; i++) {
        const item = discoverTvResults.results[i];
        const doc = await getCachedFeed(tokenPayload, item, MediaType.tv, genresTv);
        discoverTvResp.push(doc);
    }
    const feed: IFeed = {
        result: discoverTvResp,
        page: discoverTvResults.page,
        pages: discoverTvResults.total_pages
    };
    ok(res, feed);
};

/**
 * Discover routes
 */
discoverRouter.get('/movie', asyncErrorWrap(discoverMovie));
discoverRouter.get('/tv', asyncErrorWrap(discoverTv));

export {discoverRouter};
