import * as functions from 'firebase-functions'; // for WhatsApp (v2 style)
import * as functionsV1 from 'firebase-functions/v1'; // for Realtime DB (v1 style)

import * as admin from 'firebase-admin';
import axios from "axios";

const token = functions.config().whatsapp.token;
const phoneId = functions.config().whatsapp.phone_id;
const ownerNumber = functions.config().whatsapp.owner;

admin.initializeApp();

interface WhatsAppPayload {
  customerNumber: string;
  message: string;
}

// Triggered when a new order is placed in Realtime Database
export const notifyAdminsOnOrder = functionsV1.database
  .ref('/SPT/CustomerOrder/{userId}/{orderId}') // ✅ corrected path
  .onCreate(async (snapshot, context) => {
    const orderData = snapshot.val();
    const orderId = context.params.orderId;
    console.log('Order Data:', JSON.stringify(orderData, null, 2));
    console.log(context);
    const customername = orderData?.custName || "Unknown";

    const message = {
      notification: {
        title: 'New Order Received',
        body: `Customer Name: ${customername}\nOrder ID: ${orderId} has been placed.`,
      },
      topic: 'admin',
    };

    try {
      await admin.messaging().send(message);
      console.log(`Notification sent for order: ${orderId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    return null;
  });

  // export const sendWhatsAppMessage = functions
  // .https.onCall(async (data, context) => {
  //   const { customerNumber, message } = data.data;

  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   };

  //   const body = {
  //     messaging_product: "whatsapp",
  //     to: customerNumber,
  //     type: "text",
  //     text: {
  //       body: message,
  //     },
  //   };

  //   const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  //   try {
  //     // Send message to customer
  //     await axios.post(url, body, { headers });

  //     // Send message to store owner
  //     await axios.post(url, { ...body, to: ownerNumber }, { headers });

  //     return { success: true };
  //   } catch (err: any) {
  //       console.error("WhatsApp send error:", err.response?.data || err.message);
  //       throw new functions.https.HttpsError("internal", "Failed to send WhatsApp message");
  //     }
  //   }
  // );