import {thumbnailUrl, videoUrl} from "../caches/urls";
import * as util from "util";

export interface IVideo {
  title: string;
  link: string;
  thumbnail: string;
}

export const Video = (i): IVideo => {
    return {
        title: i.name,
        link: util.format(videoUrl[i.site], i.key),
        thumbnail: util.format(thumbnailUrl[i.site], i.key)
    }
};