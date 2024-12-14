import { HeroSection } from "../components/HeroSection";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Features } from "../components/Newsletter";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { DealOfTheDay } from "../components/DealoftheDay";


export const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <CategoryCarousel />
            <DealOfTheDay />
            <FeaturedProducts />
            <Features />
            <Testimonials />
            <Footer />
        </div>
    )
}