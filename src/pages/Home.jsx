import React from 'react'
import Navbar from '../components/Navbar'
import MainArea from '../components/MainArea'
import { useSearchParams } from "react-router-dom";
const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  return (
    <>
    <div className="h-screen flex flex-col overflow-hidden">

    
    <Navbar />
    <MainArea selectedCategory={category} />
    </div>
    </>
  )
}

export default Home
