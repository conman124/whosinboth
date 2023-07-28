import { useEffect, useState } from "react";
import API from "../api";
import { Credit, Movie } from "@/api/types";
import { assert } from "console";

function Row({person1, person2}: {person1: Credit, person2: Credit})
{
    return (
        <tr>
            <td>
                {person1.name}
            </td>
            <td>
                {person1.character}
            </td>
            <td>
                {person2.character}
            </td>
        </tr>
    );
}


export default function DisplayResults({movie1: movieName1, movie2: movieName2}: {movie1: string, movie2: string }) { 
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");
    let [movie1, setMovie1] = useState<Movie>();
    let [movie2, setMovie2] = useState<Movie>();
    let [peopleInCommon, setPeopleInCommon] = useState<[Credit, Credit][]>([]);

    useEffect(() => {
        async function load() {
            let api = new API();
            let [movieResult1, movieResult2] = await Promise.all([api.search(movieName1), api.search(movieName2)]);
            setMovie1(movieResult1);
            setMovie2(movieResult2);
            let [cast1, cast2] = await Promise.all([api.credits(movieResult1.id), api.credits(movieResult2.id)]);

            let cast1Map = new Map(cast1.map(person => [person.id, person]));
            let cast2Map = new Map(cast2.filter(person => cast1Map.has(person.id)).map(person => [person.id, person]));

            // cast 1 now has everyone, and cast 2 now has only the people in both
            // now combine the two into an array of tuples of the credits for both movies
            let peopleInCommon: [Credit, Credit][] = [];
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
        <div>
            {loading ?
                <div>
                    <div className="align-middle inline-block w-12 h-12 rounded-full border-4 border-slate-600 border-l-transparent animate-spin" />
                </div>
            : error || !movie1 || !movie2 ?
                <div>Error {error}</div>
            :
                <table>
                    <thead>
                        <td></td>
                        <td>{movie1.title}</td>
                        <td>{movie2.title}</td>
                    </thead>
                    <tbody>
                        {peopleInCommon.map(([person1, person2]) => <Row person1={person1} person2={person2} />)}
                    </tbody>
                </table>
            }
        </div>
    );
}