export const config = {
    api_name: process.env.API_NAME || 'api',
    api_version: process.env.API_VERSION || 'v1',
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    jwt_private_key: process.env.JWT_PRIVATE_KEY || '12345678910',
    jwt_expiration: process.env.JWT_EXPIRATION || '1h',
    jwt_public_expiration: process.env.JWT_PUBLIC_EXPIRATION || '24h',
    feed_limit_page: process.env.FEED_LIMIT_PAGE || 20,
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    },
    tmdb_token: process.env.TMDB_TOKEN || 'IMDB TOKEN',
    cors_allow_origin: process.env.CORS_ALLOW_ORIGIN || 'http://localhost:4200'
};