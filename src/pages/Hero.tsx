//@ts-nocheck

import HeroCarousel from "@/components/HeroCarousel"
import FeatureCards from "@/components/FeatureCards";
import ProductCarousel from "@/components/ProducCarousel";
import Footer from "@/components/Footer";
import { Helmet } from 'react-helmet-async';

const Hero = () => {
  return (
    <>
      <Helmet>
        <title>SPT Crackers | Buy Quality Crackers Online from Sivakasi</title>
        <meta name="description" content="Buy quality fireworks and crackers online at the lowest price from SPT Crackers, Sivakasi — the Crackers City of India." />
        <meta name="keywords" content="buy crackers online, sivakasi crackers, fireworks, SPT crackers, crackers city, quality crackers, cheap crackers, diwali crackers, discount crackers" />
        <meta property="og:title" content="SPT Crackers - Quality Crackers from Sivakasi" />
        <meta property="og:description" content="Get the best deals on crackers directly from Sivakasi – India's Crackers City. Safe, certified, and budget-friendly fireworks." />
        <meta property="og:image" content="/meta/home-banner.jpg" />
        <meta property="og:url" content="https://sptcrackers.com/" />
      </Helmet>
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
    </>
  );
};

export default Hero;
