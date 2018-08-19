import {IFeedItem} from "./feedItem";
import {getToken} from "../utils/jwt";
import {ITokenPlayload, TokenPayload} from "./token";
import {IUserModel} from "../models/userModel";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  language: string;
  region: string;
  favorites: IFeedItem[];
  watched: IFeedItem[];
  theme: string;
  role: string;
}

export interface IUserProfile {
    user_id: string;
    name: string;
    email: string;
    language: string;
    region: string;
    theme: string;
    role: string;
    token: string;
}

export class UserFactory {
    static userProfile(doc: IUserModel, withoutToken = false): IUserProfile {
        let token: string | any = null;
        if (!withoutToken) token = getToken(TokenPayload({
                user_id: doc._id.toString(),
                language: doc.language,
                region: doc.region,
                role: doc.role
            })
        );
        return {
            user_id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            language: doc.language,
            region: doc.region,
            theme: doc.theme,
            role: doc.role,
            token: token
        }
    }
}

export enum Roles {
    USER = 'USER',
    DEPLOYER = 'DEPLOYER',
    VALIDATOR = 'VALIDATOR',
    ADMIN = 'ADMIN',
    PUBLIC = 'PUBLIC'
}