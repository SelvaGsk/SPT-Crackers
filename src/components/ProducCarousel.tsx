//@ts-nocheck

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const products = [
  {
    title: "Amazing Flower Pots",
    offer: "50% offer",
    image: "/products/flower-pot.png",
    bgColor: "bg-red-600",
  },
  {
    title: "Blasting Bombs",
    offer: "50% offer",
    image: "/products/blasting-bombs.png",
    bgColor: "bg-blue-400",
  },
  {
    title: "Crackling Sparklers",
    offer: "50% offer",
    image: "/products/sparklers.png",
    bgColor: "bg-gradient-to-br from-pink-500 to-blue-400",
  },
  {
    title: "Colorful Rockets",
    offer: "30% offer",
    image: "/products/rockets.png",
    bgColor: "bg-yellow-400",
  },
  {
    title: "Twinkling Chakras",
    offer: "20% offer",
    image: "/products/chakra.png",
    bgColor: "bg-purple-500",
  },
  {
    title: "Diwali Combo Pack",
    offer: "60% offer",
    image: "/products/combo.png",
    bgColor: "bg-gradient-to-r from-green-400 to-blue-500",
  },
]

export default function ProductCarousel() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        autoplay={{ delay: 4000 }} // 4 seconds
        pagination={{ clickable: true }}
      >
        {products.map((product, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`rounded-lg p-6 h-72 relative overflow-hidden ${product.bgColor} text-white`}
            >
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-green-300 text-lg mt-2">{product.offer}</p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded font-semibold shadow">
                Shop Now
              </button>
              <img
                src={product.image}
                alt={product.title}
                className="absolute bottom-0 right-0 h-36 object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
