//@ts-nocheck


import { useFirebase } from "@/Services/context";
import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { useForm } from "react-hook-form";
import Footer from "@/components/Footer";
import { get, ref } from "firebase/database";
import { database } from "@/Services/Firebase.config.js";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CheckOut = () => {
  const { cartItems, getUser, user, placeOrder } = useFirebase();
  const cartArray = Object.values(cartItems || {});
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [dbUser, setdbUser] = useState();
  const [packageCharge, setdpackageCharge] = useState(0);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [formData, setFormData] = useState();
  const [showDialog, setShowDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getPackgeCost = async () => {
    const userRef = ref(database, `SPT/Settings`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return;
    const item = snapshot.val();
    setdpackageCharge(item[0].packageCharge);
  };

  useEffect(() => {
    const getUse = async () => {
      const u = await getUser();
      setdbUser(u);
    };
    getUse();
    getPackgeCost();
  }, [user]);

  const checkoutItems = cartArray.filter(item => !excludedIds.includes(item.productId));
  const totalAmount = checkoutItems.reduce((acc, item) => acc + item.salesPrice * item.qty, 0);
  const packingChargeAmount = packageCharge ? (totalAmount * (packageCharge / 100)) : 0;
  const finalAmount = totalAmount + packingChargeAmount;

  const handleRemoveFromCheckout = (id: string) => {
    setExcludedIds(prev => [...prev, id]);
  };

  const onSubmit = data => {
    setFormData(data);
    setShowDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* 🧾 Order Summary */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl p-6 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">🧾 Order Summary</h2>
              {excludedIds.length > 0 && (
                <button
                  onClick={() => setExcludedIds([])}
                  className="text-sm text-emerald-600 hover:underline transition"
                  title="Restore all removed items"
                >
                  🔄 Reload
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="text-gray-800 font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Packing Charges</span>
                <span className="text-gray-800 font-semibold">₹{packingChargeAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 space-y-5 max-h-[400px] overflow-y-auto">
              {checkoutItems.length === 0 ? (
                <p className="text-center text-gray-500 italic">No items selected.</p>
              ) : (
                checkoutItems.map(item => (
                  <div key={item.productId} className="flex items-start gap-4 group relative">
                    <img
                      src={item.productImageURL}
                      alt={item.productName}
                      className="w-20 h-24 rounded-xl object-cover border shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm leading-tight">{item.productName}</h3>
                      <div className="text-xs mt-1">
                        <span className="text-red-400 line-through">₹{item.beforeDiscPrice?.toFixed(2)}</span>
                        <span className="ml-2 text-emerald-600 font-semibold">
                          ₹{item.salesPrice?.toFixed(2)} × {item.qty} = ₹
                          {(item.salesPrice * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCheckout(item.productId)}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-lg p-1 rounded-full transition"
                      title="Remove from checkout"
                    >
                      <CiTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 📋 Billing Section */}
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Billing Details</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="address"
                  checked={useExistingAddress}
                  onChange={() => {
                    setUseExistingAddress(true);
                    reset();
                  }}
                  className="accent-emerald-500"
                />
                Use existing address
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="address"
                  checked={!useExistingAddress}
                  onChange={() => setUseExistingAddress(false)}
                  className="accent-emerald-500"
                />
                Use new address
              </label>
            </div>

            {!useExistingAddress ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <input
                    {...register("name", { required: "Full Name is required" })}
                    placeholder="Full Name"
                    className={`border rounded-lg p-3 w-full ${errors.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="col-span-2">
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit Indian phone number",
                      },
                    })}
                    placeholder="Phone Number"
                    className={`border rounded-lg p-3 w-full ${errors.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="col-span-2">
                  <input
                    {...register("addressLine1", { required: "Address is required" })}
                    placeholder="Address Line 1"
                    className={`border rounded-lg p-3 w-full ${errors.addressLine1 ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>

                <input
                  {...register("pincode", {
                    required: "PIN Code is required",
                    pattern: { value: /^\d{6}$/, message: "Invalid PIN Code" },
                  })}
                  placeholder="PIN Code"
                  className={`border rounded-lg p-3 ${errors.pincode ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                />

                <select
                  {...register("city", { required: "City is required" })}
                  className={`border rounded-lg p-3 ${errors.city ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                >
                  <option value="">Select a City</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>

                <input
                  {...register("district", { required: "District is required" })}
                  placeholder="District"
                  className={`border rounded-lg p-3 ${errors.district ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                />
                <input
                  {...register("state", { required: "State is required" })}
                  placeholder="State"
                  className={`border rounded-lg p-3 ${errors.state ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                />
              </form>
            ) : (
              dbUser && (
                <div className="space-y-2 text-sm bg-gray-50 border p-4 rounded-lg text-gray-700">
                  <p><strong>Name:</strong> {dbUser.accounterName}</p>
                  <p><strong>Address:</strong> {dbUser.address}</p>
                  <p><strong>PIN Code:</strong> {dbUser.pinCode}</p>
                  <p><strong>Mobile:</strong> {dbUser.mobileNo}</p>
                  <p><strong>District:</strong> {dbUser.district}</p>
                  <p><strong>State:</strong> {dbUser.state}</p>
                </div>
              )
            )}

            {/* Confirm Order */}
            <div className="col-span-2 text-right mt-6">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 shadow-md"
                disabled={checkoutItems.length === 0}
                onClick={() => {
                  if (!useExistingAddress) {
                    handleSubmit(onSubmit)();
                  } else {
                    setShowDialog(true);
                  }
                }}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showDialog && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Order Placement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to place this order? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  placeOrder(checkoutItems, packingChargeAmount, useExistingAddress, formData,totalAmount);
                  setShowDialog(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yes, Place Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Footer />
    </>
  );
};

export default CheckOut;
