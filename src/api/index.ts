import axios from "axios";
import { Configuration, Credits, FullCredits, Movie, MovieSearch } from "./types";
import { createContext } from "react";

const BASE_URL = "https://api.themoviedb.org";

// Normally, I would not include an API key in client side javascript. However, based on some
// posts from the creator of themoviedb, it is OK in this situation because the API is rate-limited
// based on IP rather than API key, and because the API is free anyway, so there's no real incentive
// to steal keys.
// See https://www.themoviedb.org/talk/52c61af419c2952ac805bc3
// and https://www.themoviedb.org/talk/505e1089760ee32de40000cf
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmZiMjczYzRiZjg5ZGM2ODM5ODNhZDJmNGRkZWI1YiIsInN1YiI6IjY0YmQ5YjgxZTlkYTY5MDEwZDQxMDgzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5Fz9z2GegHVARFjhDobbyfg4d53nJxu2EH0M4qz3bEM";

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `Bearer ${API_KEY}`
    }
});

// TODO add retry and rate limiting?
export default class API {
    async search(name: string): Promise<Movie> {
        // TODO url encode
        let movieSearch = MovieSearch.parse((await instance.get(`/3/search/movie?query=${name}`)).data);
        if(movieSearch.results.length >= 1) {
            return movieSearch.results[0];
        } else {
            throw new Error("Could not find a movie matching that title.");
        }
    }

    async credits(movie_id: number): Promise<Credits> {
        let fullCredits = FullCredits.parse((await instance.get(`/3/movie/${movie_id}/credits`)).data);
        return fullCredits.cast;
    }
}

export const APIContext = createContext(new API())