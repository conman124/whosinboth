import React, { useContext, useEffect, useState } from "react";
import API, { APIContext } from "../api";
import { Configuration, Credit, Movie } from "@/api/types";

// I'm hardcoding this URL
function imageUrl(imagePath: string, size: string) {
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
}

function PosterImage({imagePath}: {imagePath: string})
{
    // I'm hardcoding the image sizes
    return (
        <React.Fragment>
            <img src={imageUrl(imagePath, "w92")} className="md:hidden" />
            <img src={imageUrl(imagePath, "w185")} className="hidden md:block" />
        </React.Fragment>
    );
}

function ProfileImage({imagePath}: {imagePath: string})
{
    return (
        <React.Fragment>
            <img src={imageUrl(imagePath, "w45")} className="lg:hidden" />
            <img src={imageUrl(imagePath, "w185")} className="hidden lg:block" />
        </React.Fragment>
    );
}

function Row({person1, person2}: {person1: Credit, person2: Credit})
{
    let profile = person1.profile_path ? <ProfileImage imagePath={person1.profile_path} /> : null;

    return (
        <tr>
            <td className="p-4 flex flex-col justify-center">
                {profile}
                <div className="text-center">{person1.name}</div>
            </td>
            <td className="p-4">
                {person1.character}
            </td>
            <td className="p-4">
                {person2.character}
            </td>
        </tr>
    );
}


export default function DisplayResults({movie1: movieName1, movie2: movieName2}: {movie1: string, movie2: string }) { 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [movie1, setMovie1] = useState<Movie>();
    const [movie2, setMovie2] = useState<Movie>();
    const [peopleInCommon, setPeopleInCommon] = useState<[Credit, Credit][]>([]);
    const api = useContext(APIContext);

    useEffect(() => {
        async function load() {
            const [movieResult1, movieResult2] = await Promise.all([api.search(movieName1), api.search(movieName2)]);
            setMovie1(movieResult1);
            setMovie2(movieResult2);
            const [cast1, cast2] = await Promise.all([api.credits(movieResult1.id), api.credits(movieResult2.id)]);

            const cast1Map = new Map(cast1.map(person => [person.id, person]));
            const cast2Map = new Map(cast2.filter(person => cast1Map.has(person.id)).map(person => [person.id, person]));

            // cast 1 now has everyone, and cast 2 now has only the people in both
            // now combine the two into an array of tuples of the credits for both movies
            const peopleInCommon: [Credit, Credit][] = [];
            for(const [id, person] of cast2Map) {
                peopleInCommon.push([cast1Map.get(id) as Credit, cast2Map.get(id) as Credit])
            }

            // Sort by popularity. Presumably this should put the more well known actors/actresses on top of the list
            peopleInCommon.sort((a,b) => b[0].popularity - a[0].popularity);
            setPeopleInCommon(peopleInCommon);
        }

        load().catch((e) => {
            // TODO some of these are probably just not finding the right movie
            console.error(e);
            setLoading(false);
            setError("There was an error loading the data.  Please try again.");
        });
    }, [movieName1, movieName2]);

    return (
        <div className="md:flex md:justify-center w-full p-8">
            {loading ?
                <div>
                    <div className="align-middle inline-block w-12 h-12 rounded-full border-4 border-slate-600 border-l-transparent animate-spin" />
                </div>
            : error || !movie1 || !movie2 ?
                <div>Error {error}</div>
            :
                <table>
                    <thead>
                        <th></th>
                        <th className="px-4">
                            {movie1.poster_path ? <PosterImage imagePath={movie1.poster_path} /> : null}
                            { /* Firefox seems to have a default style of bolding th, which wasn't removed
                                 by Tailwind style reset, so remove it with font-normal*/ }
                            <div className="align-middle text-2xl font-normal pt-2">{movie1.title}</div>
                        </th>
                        <th className="px-4">
                            {movie2.poster_path ? <PosterImage imagePath={movie2.poster_path} /> : null}
                            <div className="align-middle text-2xl font-normal pt-2">{movie2.title}</div>
                        </th>
                    </thead>
                    <tbody>
                        {peopleInCommon.map(([person1, person2]) => <Row person1={person1} person2={person2} />)}
                    </tbody>
                </table>
            }
        </div>
    );
}