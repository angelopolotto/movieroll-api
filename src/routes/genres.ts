import * as express from 'express';
import {getGenresMovie, getGenresTv} from "../caches/genres";
import {asyncErrorWrap, ok} from "../middlewares/utils";
const genresRouter = express.Router();

export const genresMovie = async (req, res) => {
    const tokenPayload = req.user;
    const genres = await getGenresMovie(tokenPayload.language);
    ok(res, genres);
};

export const genresTv = async (req, res) => {
    const tokenPayload = req.user;
    const genres = await getGenresTv(tokenPayload.language);
    ok(res, genres);
};

/**
 * Genres routes
 */
genresRouter.get('/movie', asyncErrorWrap(genresMovie));
genresRouter.get('/tv', asyncErrorWrap(genresTv));

export {genresRouter};
