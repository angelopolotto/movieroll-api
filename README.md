# Movie Roll API

This project was made with Node.js and Typescript

## Environment vars

All the configuration var can be changed in the `src/config`. You can set the configuration in the env of the docker too.

This project require:
 * MongoDb server address; 
 * MovieDB API key (https://developers.themoviedb.org/3).

## Development server

Install typescript compiler and tsc-watch:

```
npm install tsc -g
npm install tsc-watch-g
```

Install dependencies with `npm install`.

Run development server with `npm run dev`.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `build/` directory.