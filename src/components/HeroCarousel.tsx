//@ts-nocheck

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useFirebase } from "@/Services/context";
import { useEffect, useState } from "react";

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const { setting, getBannerUrls } = useFirebase();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    getBannerUrls();
  }, []);
  if(!setting)
  {
    return <div className="flex items-center justify-center" >
      <img src="/loader.svg" className="w-[200px] h-[100px] text-4xl"/>
    </div>
  }
  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
      <CarouselContent className="hidden md:flex">
        {setting[0]?.bannerImages?.map((url, index) => (
          <CarouselItem key={index}>
            <div className="w-full h-[300px]  md:h-[500px] ">
              <img
                src={url}
                alt={`banner-${index}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselContent className="md:hidden flex">
        {setting[0]?.bannerImages2?.map((url, index) => (
          <CarouselItem key={index}>
            <div className="w-full h-[300px]  md:h-[500px] ">
              <img
                src={url}
                alt={`banner-${index}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroCarousel;
