import {Document, Schema, model, Model} from "mongoose";
import * as timestamp from 'mongoose-timestamp';
import {IUser} from "../interfaces/user";

export interface IUserModel extends IUser, Document {
}

const UserSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            min: [3, 'must be at least 3 characters']
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return emailRegex.test(v);
                },
                message: `{VALUE} is not a valid email`
            }
        },
        passwordHash: {
            type: String,
            required: true,
            trim: true,
        },
        salt: {
            type: String,
            required: true,
            trim: true,
        },
        language: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    const langRegex = /^(en-US|pt-BR|es-AR)$/;
                    return langRegex.test(v);
                },
                message: `{VALUE} not supported, must be 'en-US', 'pt-BR' or 'es-AR' (ISO-639-1 codes)`
            }
        },
        region: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    const regex = /^(US|BR|AR)$/;
                    return regex.test(v);
                },
                message: `{VALUE} not supported, must be 'US', 'BR' or 'AR' (ISO-639-1 codes)`
            }
        },
        watched: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'FeedItem',
                }
            ]
        },
        favorites: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'FeedItem',
                }
            ]
        },
        theme: {
            type: String,
            default: 'deeppurple-theme',
            trim: true,
            min: [3, 'must be at least 3 characters']
        },
        role: {
            type: String,
            enum: ['USER', 'DEPLOYER', 'VALIDATOR', 'ADMIN', 'PUBLIC'],
            default: 'USER',
            trim: true
        }
    },
    {minimize: false},
);

UserSchema.plugin(timestamp);

export const UserModel: Model<IUserModel> = model<IUserModel>('User', UserSchema);