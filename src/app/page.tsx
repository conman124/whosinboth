"use client";

import Search from "@/components/Search";
import DisplayResults from "@/components/DisplayResults";
import { useState } from "react";

export default function Home() {
  let [movie1, setMovie1] = useState<string>();
  let [movie2, setMovie2] = useState<string>();

  if(movie1 && movie2) {
    return <DisplayResults movie1={movie1} movie2={movie2} />
  } else {
    return <Search onSubmit={(a,b)=>{setMovie1(a); setMovie2(b)}}/>
  }
}
