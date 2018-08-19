import * as MovieDb from 'moviedb-promise';
import {GenresModel} from "../models/genresModel";
import {config} from "../config";
import {MediaType} from "../interfaces/feedItem";
import {IGenre} from "../interfaces/genre";

const moviedb = new MovieDb(config.tmdb_token);

export const getGenresMovie = async (language: string): Promise<IGenre[]> => {
    const doc = await GenresModel.findOne({language, media_type: MediaType.movie});
    if(!doc) {
        const genresMovie = await moviedb.genreMovieList({
            language
        });
        const genresModelNew = new GenresModel({media_type: MediaType.movie, language, genres: genresMovie.genres});
        const docNew = await genresModelNew.save();
        return docNew.genres;
    }
    return  doc.genres;
};

export const getGenresTv = async (language: string): Promise<IGenre[]> => {
    const doc = await GenresModel.findOne({language, media_type: MediaType.tv});
    if(!doc) {
        const genresTv = await moviedb.genreTvList({
            language: language
        });
        const genresModelNew = new GenresModel({media_type: MediaType.tv, language, genres: genresTv.genres});
        const docNew = await genresModelNew.save();
        return docNew.genres
    }
    return doc.genres;
};