import axios from "axios";
import { UserNavbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Features } from "../components/Newsletter";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { DealOfTheDay } from "../components/DealoftheDay";





export const UserDashboard = () => {
  const { UserId } = useParams<{ UserId: string }>();
  const [image, setImage] = useState("");
  console.log(UserId);
  useEffect(()=>{
    const getData = async () => {
      const response = await axios.get(`http://localhost:3000/UserDashboard/${UserId}`);
      if(response && response.data){
        setImage(response.data.UserInfo.img);
      }
    }
    getData();
  },[])



  return (
    <div className="w-screen min-h-screen">
      <UserNavbar ImageURl={image} />
      <HeroSection />
      <CategoryCarousel/>
      <DealOfTheDay/>
      <FeaturedProducts/>
      <Features/>
      <Testimonials/>
      <Footer/>
    </div>
  );
};