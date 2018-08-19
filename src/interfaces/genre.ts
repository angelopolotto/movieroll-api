export interface IGenre {
  id: number;
  name: string;
}

export interface IGenres {
    media_type: string,
    language: string,
    region: string,
    genres: IGenre[]
}