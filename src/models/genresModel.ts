import {Document, Model, model, Schema} from "mongoose";
import {IFeedItemModel} from "./feedItemModel";
import * as timestamp from 'mongoose-timestamp';
import {IFeedItem} from "../interfaces/feedItem";
import {IGenres} from "../interfaces/genre";

export interface IGenresModel extends IGenres, Document {
}

const GenresSchema = new Schema(
    {
        media_type: {
            type: 'String'
        },
        language: {
            type: 'String'
        },
        region: {
            type: 'String'
        },
        genres: {
            type: [
                {
                    id: 'Number',
                    name: 'String'
                }
            ]
        }
    },
    {minimize: false},
);

GenresSchema.plugin(timestamp);

export const GenresModel: Model<IGenresModel> = model<IGenresModel>('Genres', GenresSchema);