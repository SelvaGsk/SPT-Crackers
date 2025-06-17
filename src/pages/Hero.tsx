//@ts-nocheck

import HeroCarousel from "@/components/HeroCarousel"
import FeatureCards from "@/components/FeatureCards";
import ProductCarousel from "@/components/ProducCarousel";
import Footer from "@/components/Footer";

const Hero = () => {
  return (
    <div className="flex flex-col min-h-screen">
     
      <section className="flex-1">
        <HeroCarousel />
      </section>
      <section className="relative mt-12">
        <FeatureCards/>
      </section>
      <section>
        <ProductCarousel/>
      </section>
      <section>
        <Footer/>
      </section>

    </div>
  );
};

export default Hero;
