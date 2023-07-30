import { z } from "zod";
/*
//    {
    "adult": false,
    "backdrop_path": "/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg",
    "genre_ids": [
      35,
      12,
      14
    ],
    "id": 346698,
    "original_language": "en",
    "original_title": "Barbie",
    "overview": "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    "popularity": 5675.527,
    "poster_path": "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "release_date": "2023-07-19",
    "title": "Barbie",
    "video": false,
    "vote_average": 7.754,
    "vote_count": 688
  },
*/
export const Movie = z.object({
    id: z.number(),
    poster_path: z.nullable(z.string()),
    title: z.string()
});

export type Movie = z.infer<typeof Movie>;

export const MovieSearch = z.object({
    results: z.array(Movie)
});

export type MovieSearch = z.infer<typeof MovieSearch>

export const Credit = z.object({
    id: z.number(),
    name: z.string(),
    profile_path: z.nullable(z.string()),
    character: z.string(),
    popularity: z.number()
});

export type Credit = z.infer<typeof Credit>;

export const Credits = z.array(Credit);

export type Credits = z.infer<typeof Credits>;

export const FullCredits = z.object({
    id: z.number(),
    cast: Credits
});

export type FullCredits = z.infer<typeof FullCredits>;

export const Configuration = z.object({
    images: z.object({
        secure_base_url: z.string(),
        poster_sizes: z.array(z.string())
    })
});

export type Configuration = z.infer<typeof Configuration>;