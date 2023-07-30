import { useState } from "react";

export default function Search(props: {onSubmit: (movie1:string,movie2:string) => void }) { 
  const [movie1, setMovie1] = useState("");
  const [movie2, setMovie2] = useState("");

  return (
    <div className="md:flex md:justify-center w-full p-8">
        <div className="w-full md:w-2/3 lg:w-1/2 text-center">
            <form onSubmit={()=>props.onSubmit(movie1, movie2)}>
                Who stars in both
                <input 
                    className="block p-3 my-4 border-solid border-slate-400 border rounded w-full text-center"
                    type="text"
                    value={movie1}
                    onChange={e=>setMovie1(e.target.value)}
                    placeholder={"First movie, try \"Barbie\""}
                />
                and
                <input
                    className="block p-3 my-4 border-solid border-slate-400 border rounded w-full text-center"
                    type="text"
                    value={movie2}
                    onChange={e=>setMovie2(e.target.value)}
                    placeholder={"Second movie, try \"Cruella\""}
                />
                <button
                    type="submit"
                    disabled={!movie1 || !movie2}
                    className="block p-3 mt-6 border-solid bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold border-green-950 border rounded text-center w-full disabled:bg-slate-100 disabled:border-slate-600 disabled:text-slate-400"
                >Go</button>
            </form>
        </div>
    </div>
    )
}