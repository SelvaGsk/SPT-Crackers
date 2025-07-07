//@ts-nocheck
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, provider, database } from "./Firebase.config.js";
import toast from "react-hot-toast";
import {
  get,
  onValue,
  ref,
  remove,
  set,
  push 
} from "firebase/database";
import { useNavigate } from "react-router-dom";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase.config.js";

// ---- Interface ----
interface FirebaseContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  gooleSignIn: () => Promise<void>;
  setting:any;
  signUp: (data: any) => Promise<void>;
  toggleWishList: (productId: string) => Promise<void>;
  toggleCart: (product: any) => Promise<void>;
  GsignUp:() => Promise<void>;
  updateCartQty: (productId: string, type: "inc" | "dec" | number) => Promise<void>;
  placeOrder: (
    billProductList: any[],
    packingChargeAmount: number,
    useExistingAddress: boolean,
    formData: any,
    totalAmount: number
  ) => Promise<void>;
  getCustomerOrders: () => Promise<any>;
  getBannerUrls: () => Promise<any>;
  getUser: () => Promise<any>;
  getOrders: () => Promise<any>;
  getupdateCustomerOrders:(uid:string,orderid:string)=>Promise<void>;
  products:any,
  cartItems: any;
  wishlistIds: any[];
  searchTerm: string;
  TAGS:any;
  loading:boolean;
  dbuser:any;
  userloading:any;
  setdbUser: React.Dispatch<React.SetStateAction<any>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}


// ---- Create Context ----
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlistIds, setWishlistIds] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [setting,setSetting]=useState();
  const [TAGS,setTags]=useState();
  const [loading, setLoading] = useState(false);
  const [dbuser, setdbUser] = useState(null);

  const [userloading, setuserLoading] = useState(true);
 


  const navigate = useNavigate();

  useEffect(() => {
  
    const unsubscribe = onAuthStateChanged(auth, async(firebaseUser) => {
        
     
      setUser(firebaseUser);
      setuserLoading(false);
    getBannerUrls();

    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const idsRef = ref(database, `SPT/Wishlist/${user.uid}`);
    const unsubscribe = onValue(idsRef, (snapshot) => {
      const data = snapshot.val();
      setWishlistIds(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const cartRef = ref(database, `SPT/tempCart/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      setCartItems(snapshot.exists() ? snapshot.val() : {});
    });
    return () => unsubscribe();
  }, [user]);
  
 useEffect(() => {
    const productsRef = ref(database, "SPT/Products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(()=>{
 const TagsRef = ref(database, "SPT/GeneralMaster/Tags");
    const unsubscribe = onValue(TagsRef, (snapshot) => {
      const data = snapshot.val();
     
        setTags(data);
      
    });

    return () => unsubscribe();
  },[])
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.message);
    }finally{
      setLoading(false);

    }
  };

  const signUp = async (data: any) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast.success("Account created successfully!");

      if (userCredential) {
        const customerData = {
          accountMasterCode: 0,
          accounterId: "",
          accounterName: data.firstName,
          address: data.address,
          billingAddress: "",
          closingBal: 0,
          companyID: "",
          district: data.district,
          gstin: "",
          id: userCredential.user.uid,
          importStatus: false,
          mobileNo: data.phone,
          pinCode: data.pinCode,
          refer: data.referredBy,
          state: data.state,
        };

        await set(
          ref(database, `SPT/Customers/${userCredential.user.uid}`),
          customerData
        );
      }
      setLoading(false);

    } catch (error: any) {
      console.error("Error creating user:", error.message);
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  };
  const GsignUp = async (data: any) => {
    try {
      if (!user) return;
        setLoading(true);
        const customerData = {
          accountMasterCode: 0,
          accounterId: "",
          accounterName: data.firstName,
          address: data.address,
          billingAddress: "",
          closingBal: 0,
          companyID: "",
          district: data.district,
          gstin: "",
          id: user.uid,
          importStatus: false,
          mobileNo: data.phone,
          pinCode: data.pinCode,
          refer: data.referredBy,
          state: data.state,
        };

        await set(
          ref(database, `SPT/Customers/${user.uid}`),
          customerData
        );
      toast.success("Account updated successfully!");
        setLoading(false);
      
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      toast.error(error.message);
    }
    finally{
      setLoading(false);

    }
  };

  const gooleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      
      // console.log(user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Successfully logOut!");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleWishList = async (productId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const idsRef = ref(database, `SPT/Wishlist/${user.uid}`);
    const snapshot = await get(idsRef);
    let currentIds = snapshot.exists() ? snapshot.val() : [];

    if (currentIds.includes(productId)) {
      const updatedIds = currentIds.filter((id: string) => id !== productId);
      await set(idsRef, updatedIds);
    } else {
      currentIds.push(productId);
      await set(idsRef, currentIds);
    }
  };

  const toggleCart = async (product: any) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const productRef = ref(database, `SPT/tempCart/${user.uid}/${product.productId}`);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(productRef, { ...existing, qty: existing.qty + 1 });
    } else {
      await set(productRef, { ...product, qty: 1 });
    }
  };

 

// Allow both "inc" | "dec" or a number input
const updateCartQty = async (
  productId: string,
  action: "inc" | "dec" | number
) => {
  if (!user?.uid) return;

  const productRef = ref(database, `SPT/tempCart/${user.uid}/${productId}`);
  const snapshot = await get(productRef);
  // if (!snapshot.exists()) return;

    // If product is not in cart, add it
    if (!snapshot.exists()) {
      const qty = typeof action === "number" ? action : 1;
      if (qty > 0) {
        await set(productRef, { productId, qty });
      }
      return;
    }

  const item = snapshot.val();
  let newQty: number;

  if (typeof action === "number") {
    if (isNaN(action)) return; // ⛔ Prevent setting NaN
    newQty = action;
  } else {
    newQty = action === "inc" ? item.qty + 1 : item.qty - 1;
  }

  if (newQty <= 0) {
    await remove(productRef);
  } else {
    await set(productRef, { ...item, qty: newQty });
  }
};


  const getUser = async () => {
    if (!user) return;
    const userRef = ref(database, `SPT/Customers/${user.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  const placeOrder = async (
    billProductList: any[],
    packingChargeAmount: number,
    useExistingAddress: boolean,
    formData: any,
    totalAmount: number
  ) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/` +
                      `${String(now.getMonth() + 1).padStart(2, '0')}/` +
                      `${now.getFullYear()} ` +
                      `${String(now.getHours()).padStart(2, '0')}:` +
                      `${String(now.getMinutes()).padStart(2, '0')}:` +
                      `${String(now.getSeconds()).padStart(2, '0')}`;
  
    try {
      if (!user || !user.uid) return;
      const dbUser = await getUser();
      const orderId = Date.now().toString();
      const orderRef = ref(database, `SPT/CustomerOrder/${user.uid}/${orderId}`);
      if(useExistingAddress&&!dbUser?.accounterName)
      {
        toast.error('Please update address on profile');
        return;
      }
      const orderData = {
        billNo: orderId,
        billProductList: billProductList || [],
        closed: false,
        collection: 0,
        custCode: dbUser?.custCode || "",
        custName: useExistingAddress ? dbUser?.accounterName : formData.name,
        customer: dbUser,
        date: formattedDate,
        deliveryAddress: useExistingAddress
          ? dbUser?.address
          : formData.addressLine1,
        deliveryRemarks: "",
        discountAmount: 0,
        discountPerc: 0,
        free: 0,
        import: false,
        lrNumber: "",
        netAmount: 0,
        packingCharge: packingChargeAmount,
        paymentMethodCode: 0,
        pending: 0,
        refer: "",
        statuses: {
          delivered: "false",
          orderPlaced: "false",
          payment: "false",
          shipped: "false",
        },
        totalAmount: totalAmount,
        transportName: "",
      };
 
      await set(orderRef, orderData);
      
      // console.log("Before Await");
      // await set(orderRef, orderData);
      // console.log("After Await");
      
      // // ✅ Send WhatsApp Message
      // const functions = getFunctions(app);
      // console.log("Before http Call");
      // const sendWhatsAppMessage = httpsCallable(functions, "sendWhatsAppMessage");

      // console.log("Before Send msg");

      // await sendWhatsAppMessage({
      //   customerNumber: "91xxxxxxxxxx",
      //   message: "Your order was placed successfully!",
      // });

      // console.log("After Send Msg");

    // toast.success("✅ Order placed and WhatsApp message sent!");
    toast.success("✅ Order placed successfully!");

      for (const item of billProductList) {
        const productRef = ref(
          database,
          `SPT/tempCart/${user.uid}/${item.productId}`
        );
        await remove(productRef);
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
    }
  };

  const getOrders = async () => {
    if (!user) return;
    const orderRef = ref(database, `SPT/CustomerOrder/${user.uid}`);
    const snapshot = await get(orderRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  const getBannerUrls = async () => {
    const urlRef = ref(database, `SPT/Settings`);
    const snapshot = await get(urlRef);
    setSetting(snapshot.exists() ? snapshot.val() : null);
    // console.log(snapshot.exists() ? snapshot.val() : null)
    return snapshot.exists() ? snapshot.val() : null;
  };
   const getCustomerOrders = async () => {
    const coRef = ref(database, `SPT/CustomerOrder`);
    const snapshot = await get(coRef);
    setSetting(snapshot.exists() ? snapshot.val() : null);
    // console.log(snapshot.exists() ? snapshot.val() : null)
    return snapshot.exists() ? snapshot.val() : null;
  };
  const getupdateCustomerOrders = async (uid,orderid,data) => {
    const coRef = ref(database, `SPT/CustomerOrder/${uid}/${orderid}`);
     await set(coRef,data);
     toast.success('updated')
    // console.log(uid)
    // console.log(orderid)

    // console.log(data)

  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signIn,
        signOut: logOut,
        gooleSignIn,
        signUp,
        toggleWishList,
        toggleCart,
        updateCartQty,
        getUser,
        placeOrder,
        getOrders,
        getBannerUrls,
        cartItems,
        wishlistIds,
        searchTerm,
        setSearchTerm,
        products,
        setting,
        TAGS,
        GsignUp,
        loading,
      dbuser, 
      setdbUser,
      userloading,
      getCustomerOrders,
      getupdateCustomerOrders
      
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
