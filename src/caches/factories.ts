import {MediaType, StatusTypes} from "../interfaces/feedItem";
import {ITokenPlayload} from "../interfaces/token";
import {Video} from "../interfaces/video";
import {IFeedItem, Imdb} from "../interfaces/feedItem";
import {mapGenres} from "./maps";
import {IGenre} from "../interfaces/genre";

export const tvObjFactory = (item, tokenPayload: ITokenPlayload, tvDetails, genres: IGenre[]): IFeedItem => {
    return {
        media_id: item.id,
        status_type: StatusTypes.none,
        media_type: MediaType.tv,
        vote_average: item.vote_average,
        popularity: item.popularity,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        original_title: item.original_title,
        original_language: item.original_language,
        release_date: item.first_air_date,
        genre_ids: item.genre_ids,
        language: tokenPayload.language,
        region: tokenPayload.region,
        title: item.title,
        overview: item.overview,
        genres: mapGenres(item, genres),
        news: null,
        videos: tvDetails.videos.results.map((i) => {
            return Video(i)
        }),
        imdb: Imdb(tvDetails.imdb_id),
        homepage: tvDetails.homepage
    }
};

export const movieObjFactory = (item, tokenPayload: ITokenPlayload, movieDetails, genres: IGenre[]): IFeedItem => {
    return {
        media_id: item.id,
        status_type: StatusTypes.none,
        media_type: MediaType.movie,
        vote_average: item.vote_average,
        popularity: item.popularity,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        original_title: item.original_title,
        original_language: item.original_language,
        release_date: item.release_date,
        genre_ids: item.genre_ids,
        language: tokenPayload.language,
        region: tokenPayload.region,
        title: item.title,
        overview: item.overview,
        genres: mapGenres(item, genres),
        news: null,
        videos: movieDetails.videos.results.map((i) => {
            return Video(i)
        }),
        imdb: Imdb(movieDetails.imdb_id),
        homepage: movieDetails.homepage
    };
};