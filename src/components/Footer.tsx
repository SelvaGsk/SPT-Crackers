//@ts-nocheck


import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaDribbble
} from "react-icons/fa6";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt
} from "react-icons/fa";
import { useFirebase } from "@/Services/context";

export default function Footer() {
  const {setting}=useFirebase();
  if(!setting){
    return;
  }
  return (
    <footer className="bg-gray-100 text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div>
          <img src="/logo.png" alt="Logo" className="h-10 mb-4" />
          <p className="text-sm mb-4">
            Srinivas Crackers is the biggest market of Fireworks products. Get your all favourites from our store.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-600 mt-1" />
              <span>39, Pettai Street, Thiruthangal - 626 130, Sivakasi.</span>
            </div>
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-green-600 mt-1" />
              <span>bullsinfotechsolutions@gmail.com</span>
            </div>
            <div className="flex items-start gap-2">
              <FaPhoneAlt className="text-green-600 mt-1" />
              <span>+91 8438997458</span>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div className="sm:text-left text-center">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Shop Now</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Delivery Information</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex sm:justify-start justify-center lg:justify-end gap-4">
          <p onClick={()=>{ window.open(`${setting[0]?.facebook}`, "_blank");}}  className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"><FaFacebookF /></p>
          <p onClick={()=>{ window.open(`${setting[0]?.instagram}`, "_blank");}}    className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"><FaXTwitter /></p>
          {/* <a href="#" className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"><FaDribbble /></a> */}
          <p onClick={()=>{ window.open(`${setting[0]?.instagram}`, "_blank");}}    className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"><FaInstagram /></p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-gray-600">
        © <span className="text-green-600 font-medium">Bulls InfoTech Solutions</span>, All rights reserved.
      </div>
    </footer>
  );
}
