import {IFeedItem} from './feedItem';

export interface IFeed {
  page: number;
  pages: number;
  result: IFeedItem[];
}