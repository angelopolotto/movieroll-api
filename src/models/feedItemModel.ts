import {Document, Model, model, Schema} from "mongoose";
import * as timestamp from 'mongoose-timestamp';
import * as mongoosePaginate from 'mongoose-paginate';
import {IFeedItem} from "../interfaces/feedItem";
export interface IFeedItemModel extends IFeedItem, Document {
}

const FeedIemSchema = new Schema({
        // media_id: number;
        media_id: {
            type: 'Number'
        },

        // status_type: string;
        status_type: {
            type: 'String',
            default: 'none'
        },

        // media_type: string;
        media_type: {
            type: 'String'
        },

        // vote_average: number;
        vote_average: {
            type: 'Number'
        },

        // popularity: number;
        popularity: {
            type: 'Number'
        },

        // poster_path: string;
        poster_path: {
            type: 'String'
        },

        // backdrop_path: string;
        backdrop_path: {
            type: 'String'
        },

        // release_date: Date;
        release_date: {
            type: 'Date'
        },

        // title: string;
        title: {
            type: 'String'
        },

        // overview: string;
        overview: {
            type: 'String'
        },

        // genres: string[];
        genres: {
            type: [
                'String'
            ],
            default: null
        },

        // news?: INew[];
        news: {
            type: [{
                title: 'String',
                link: 'String'
            }],
            default: null
        },

        // videos?: IVideo[];
        videos: {
            type: [{
                title: 'String',
                link: 'String',
                thumbnail: 'String'
            }],
            default: null
        },

        // imdb: string;
        imdb: {
            type: 'String',
            default: null
        },

        // homepage: string;
        homepage: {
            type: 'String',
            default: null
        },

        // language: string;
        language: {
            type: 'String'
        },

        // region: string;
        region: {
            type: 'String'
        },

        // original_title: string;
        original_title: {
            type: 'String'
        },

        // original_language: string;
        original_language: {
            type: 'String'
        },

        // genre_ids: number[];
        genre_ids: {
            type: [
                'Number'
            ]
        },

    },
    {minimize: false},
);

FeedIemSchema.plugin(timestamp);
FeedIemSchema.plugin(mongoosePaginate);

export const FeedItemModel: Model<IFeedItemModel> = model<IFeedItemModel>('FeedItem', FeedIemSchema);