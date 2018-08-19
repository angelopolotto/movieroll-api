export const mapGenres = (item, genres): string[] => {
    return genres.filter(genre => item.genre_ids.find(id => id === genre.id)).map(item => item.name);
};