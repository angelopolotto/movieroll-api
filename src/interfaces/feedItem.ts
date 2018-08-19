import {INew} from './new';
import {IVideo} from './video';
import {imdb} from "../caches/urls";
import * as util from "util";

export interface IFeedItem {
    media_id: number;
    status_type: string;
    media_type: string;
    vote_average: number;
    popularity: number;
    poster_path: string;
    backdrop_path: string;
    release_date: Date;
    title: string;
    overview: string;
    genres: string[];
    news: INew[];
    videos: IVideo[];
    imdb: string;
    homepage: string;
    language: string;
    region: string;
    original_title: string;
    original_language: string;
    genre_ids: number[];
}

export enum MediaType {
    movie = 'movie',
    tv = 'tv'
}

export enum StatusTypes {
    none = 'none',
    tv_airing_today = 'tv_airing_today',
    tv_on_the_air = 'tv_on_the_air',
    tv_popular = 'tv_popular',
    tv_top_rated = 'tv_top_rated',
    movie_upcoming = 'movie_upcoming',
    movie_now_playing = 'movie_now_playing',
    movie_popular = 'movie_popular',
    movie_top_rated = 'movie_top_rated'
}

export const Imdb = (i): string => {
    return util.format(imdb, i);
};

export class FeedItemFactory {
    static feedItem(feedItem: IFeedItem) {
        return feedItem;
    }
}