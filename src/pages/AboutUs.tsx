//@ts-nocheck


import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <>
     <section className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Text Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6 text-gray-800">About The Srinivas Crackers</h2>

          <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione, recusandae
              necessitatibus quasi incidunt alias adipisci pariatur earum iure beatae assumenda
              rerum quod. Tempora magni autem a voluptatibus neque.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vitae rerum cum
              accusamus magni consequuntur architecto, ipsum deleniti expedita doloribus suscipit
              voluptatum eius perferendis amet!.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, maxime amet
              architecto est exercitationem optio ea maiores corporis beatae, dolores doloribus
              libero nesciunt qui illum? Voluptates deserunt adipisci voluptatem magni sunt sed
              blanditiis quod aspernatur! Iusto?
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 bg-gray-50 rounded-xl p-6 grid grid-cols-3 gap-4 text-center shadow-md">
            <div>
              <h3 className="text-4xl font-bold text-emerald-500">1.2k</h3>
              <p className="font-semibold mt-1">Vendors</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-emerald-500">410k</h3>
              <p className="font-semibold mt-1">Customers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-emerald-500">34k</h3>
              <p className="font-semibold mt-1">Products</p>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="rounded-xl bg-gray-100 overflow-hidden shadow-md">
          <img
            src="/logo.png" // Adjust if needed
            alt="About Srinivas Crackers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <FeatureCards/>
      
    </section>
    <Footer/>
    </>
   
  );
};

export default AboutUs;
