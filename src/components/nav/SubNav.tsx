//@ts-nocheck


import { Button } from "@/components/ui/button";
import { FiPhone } from "react-icons/fi";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useFirebase } from "@/Services/context";

const SubNav = () => {
  const navigate = useNavigate();
  const {setting}=useFirebase();
  // console.log(setting);
  if(!setting)
  {
    return;
  }
  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center gap-15 p-4 bg-gray-50">
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/')}>Home</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/shop')}>Shop</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/track-order')}>Track Order</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/aboutus')}>About Us</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/contactus')}>Contact Us</p>
        <Button className="bg-green-500 text-white">Download Price List</Button>
        <div className="flex items-center justify-end ml-4">
          <FiPhone size={20} />
          <p className="font-semibold ml-2">+91 {setting[0]?.CellNO}</p>
        </div>
      </div>

      {/* Mobile Nav */}
      {/* Mobile Nav */}
<div className="md:hidden bg-gray-50 flex items-center justify-between px-4 py-2">
  {/* Mobile Menu */}
  <div className="">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Menu className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-56 rounded-md bg-white shadow-lg border p-2 space-y-1"
      >
        <DropdownMenuItem onClick={() => navigate('/')}>Home</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/shop')}>Shop</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/track-order')}>Track Order</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/aboutus')}>About Us</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/contactus')}>Contact Us</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert("Downloading Price List...")}>
          Download Price List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* Phone Number */}
  <div className="flex items-center justify-end">
     <p className="font-semibold ml-2">+91 {setting[0]?.CellNO}</p>
  </div>
</div>

    </>
  );
};

export default SubNav;
