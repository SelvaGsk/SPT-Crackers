//@ts-nocheck
import { Route, Routes } from "react-router-dom"
import Hero from "./pages/Hero"
import MainNav from "./components/nav/MainNav"
import SubNav from "./components/nav/SubNav"
import Login from "./pages/Login"
import OrderTrack from "./pages/OrderTrack"
import AboutUs from "./pages/AboutUs"
import ContactUsPage  from "./pages/Contactus"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import WishList from "./pages/WishList"
import CheckOut from "./pages/CheckOut"
import { useFirebase } from "./Services/context"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import Register from "./pages/Register"
import RegisterDialog from "./components/RegisterDialog"
import { FaWhatsapp } from "react-icons/fa6"
import Admin from "./pages/Admin"
import ProductAdministration from "./pages/ProductAdministration"

const App = () => {
  const { setting, products, cartItems, TAGS, user, getUser, setdbUser, userloading } = useFirebase();
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [toggle, settoggle] = useState(false);

  const whatsappRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 👇 Set initial position to bottom-right
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 100
    });
  }, []);

  // 👇 Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 60)),
          y: Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 60)),
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  useEffect(() => {
    const userChk = async () => {
      const dbUser = await getUser();
      if (!dbUser && user) {
        setNewUser(true);
        setOpenDialog(true);
      }
      if (dbUser) {
        setNewUser(false);
        setdbUser(dbUser);
      }
    };
    userChk();
  }, [user, toggle]);

  const onProfileClick = () => {
    setOpenDialog(!openDialog);
    setNewUser(true);
  };

  if (!setting && !(products.length > 0) && !TAGS && userloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.svg" className="w-[200px] h-[100px] text-4xl" />
      </div>
    );
  }

  const handleMouseDown = (e) => {
    const rect = whatsappRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragging(true);
  };

  const openWhatsApp = () => {
    const phoneRaw = setting[0]?.CellNO || '';
    const phone = phoneRaw.replace(/\s+/g, ''); // Removes all spaces
    const message = encodeURIComponent("Hi! I want to inquire about your products.");
    // console.log( `https://wa.me/${phone}?text=${message}`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <>
      <MainNav onProfileClick={onProfileClick} />
      <SubNav />
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/track-order' element={<OrderTrack />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/Contactus' element={<ContactUsPage  />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/checkout' element={<CheckOut />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/product-admin' element={<ProductAdministration />} />
      </Routes>

      {isNewUser && user?.email && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl">
            <RegisterDialog settoggle={settoggle} toggle={toggle} />
          </DialogContent>
        </Dialog>
      )}

      {/* 👇 WhatsApp Floating Button */}
      <div
        ref={whatsappRef}
        onMouseDown={handleMouseDown}
        onClick={openWhatsApp}
        className="fixed z-50 cursor-move bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
        style={{
          left: position.x,
          top: position.y,
          transition: dragging ? "none" : "0.2s"
        }}
      >
        <FaWhatsapp size={28} />
      </div>
    </>
  );
};

export default App;
