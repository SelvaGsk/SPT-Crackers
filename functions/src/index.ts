import * as functions from 'firebase-functions'; // for WhatsApp (v2 style)
import * as functionsV1 from 'firebase-functions/v1'; // for Realtime DB (v1 style)
import * as admin from 'firebase-admin';
import * as puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import corsLib from "cors";
const cors = corsLib({ origin: true });

const token = functions.config().whatsapp.token;
const phoneId = functions.config().whatsapp.phone_id;
const ownerNumber = functions.config().whatsapp.owner;


admin.initializeApp();
const bucket = admin.storage().bucket();

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

  export const generatePdf = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { html, fileName } = req.body;
        if (!html || !fileName) return res.status(400).send("Missing html or fileName");
  
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
  
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
  
        const pdfBuffer = await page.pdf({
          format: "a4",
          printBackground: true,
        });
  
        await browser.close();
  
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(pdfBuffer);
      } catch (error) {
        console.error("PDF generation failed:", error);
        res.status(500).send("Internal Server Error");
      }
    });
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