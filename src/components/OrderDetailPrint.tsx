import React from "react";
interface OrderDetailPrintProps {
  order: any;  
  setting: any;  
}

const OrderDetailPrint: React.FC<OrderDetailPrintProps> = ({ order, setting  }) => {
  const totalAmount = (order.totalAmount || 0) + (order.packingCharge || 0);
  const totalQty = order.billProductList?.reduce((acc: number, item: any) => acc + Number(item.qty || 0), 0) || 0;
  const totalProductAmount = order.billProductList?.reduce(
    (acc: number, item: any) => acc + (Number(item.qty || 0) * Number(item.salesPrice || 0)),
    0
  ) || 0;

  if (!setting) return null;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", color: "#000" }}>
      {/* ✅ Store Name and Logo Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img
          src="/CompanyLogo.png" // Update this path to your logo
          alt="SPT Crackers Logo"
          style={{ width: "80px", height: "auto", marginRight: "20px" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>SPT Crackers</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
          {setting[0]?.Address}<br />
          <span>Contact: {setting[0]?.CellNO}</span> ; 
          <span>{setting[0]?.OfficeNo}</span>
          </p>
              
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Estimation</h2>

      {/* ✅ Order Info Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td><strong>Customer Name:</strong> {order.custName}</td>
            <td><strong>Mobile No:</strong> {order.customer?.mobileNo}</td>
          </tr>
          <tr>
            <td><strong>Order ID:</strong> {order.orderId}</td>
            {/* <td><strong>Bill No:</strong> {order.billNo}</td> */}
          </tr>
          <tr>
            <td><strong>Date:</strong> {order.date}</td>
            <td><strong>Total Products:</strong> {order.totalProducts}</td>
          </tr>
          <tr>
            <td><strong>Product Amount:</strong> ₹{order.totalAmount}</td>
            <td><strong>Packing Charge:</strong> ₹{order.packingCharge}</td>
          </tr>
          <tr>
            <td colSpan={2}><strong>Total Amount:</strong> ₹{totalAmount}</td>
          </tr>
          <tr>
            <td colSpan={2}><strong>Billing Address:</strong> {order.deliveryAddress}</td>
          </tr>
          <tr>
            <td><strong>Transport Name:</strong> {order.transportName}</td>
            <td><strong>LR Number:</strong> {order.lrNumber}</td>
          </tr>
        </tbody>
      </table>

      {/* Product List */}
      <h3 style={{ marginBottom: "10px" }}>Product List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={tdStyleLeft}>Product</th>
            <th style={tdStyleRight}>Qty</th>
            <th style={tdStyleRight}>Rate (₹)</th>
            <th style={tdStyleRight}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {order.billProductList?.map((product: any, index: number) => {
            const qty = Number(product.qty || 0);
            const rate = Number(product.salesPrice || 0);
            const amount = qty * rate;
            return (
              <tr key={index}>
                <td style={tdStyleLeft}>{product.productName}</td>
                <td style={tdStyleRight}>{qty}</td>
                <td style={tdStyleRight}>{rate.toFixed(2)}</td>
                <td style={tdStyleRight}>{amount.toFixed(2)}</td>
              </tr>
            );
          })}

          {/* Summary Row */}
          <tr style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}>
            <td style={tdStyleRight}>Total</td>
            <td style={tdStyleRight}>{totalQty}</td>
            <td style={tdStyleRight}>—</td>
            <td style={tdStyleRight}>{totalProductAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* ✅ Thank You Message */}
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Thank you for your purchase! – SPT Crackers
      </p>
    </div>
  );
};

const tdStyleLeft = {
    border: "1px solid #ccc",
    padding: "8px",
    fontSize: "14px",
    textAlign: "left" as const,
  };
  
  const tdStyleRight = {
    border: "1px solid #ccc",
    padding: "8px",
    fontSize: "14px",
    textAlign: "right" as const,
  };
  
  

export default OrderDetailPrint;
