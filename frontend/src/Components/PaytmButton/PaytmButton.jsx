// import React, { useEffect, useState } from 'react';
// import PaytmChecksum from 'paytmchecksum'; // Ensure you have this library installed

// const PaytmButton = () => {
//   const [paymentData, setPaymentData] = useState({});

//   useEffect(() => {
//     initializePaytm();
//   }, []);

//   const initializePaytm = () => {
//     let orderId = "Order_" + new Date().getTime();
    
//     // Sandbox Credentials
//     let mid = ""; // Merchant ID
//     let mkey = ""; // Merchant Key
//     let paytmParams = {};

//     paytmParams.body = {
//       requestType: "Payment",
//       mid: mid,
//       websiteName: "WEBSTAGING",
//       orderId: orderId,
//       callbackUrl: "https://merchant.com/callback",
//       txnAmount: {
//         value: 100,
//         currency: "INR",
//       },
//       userInfo: {
//         custId: "1001",
//       },
//     };

//     PaytmChecksum.generateSignature(
//       JSON.stringify(paytmParams.body),
//       mkey
//     ).then((checksum) => {
//       paytmParams.head = {
//         signature: checksum,
//       };

//       const post_data = JSON.stringify(paytmParams);

//       const options = {
//         hostname: "securegw-stage.paytm.in", // Use "securegw.paytm.in" for production
//         port: 443,
//         path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Content-Length": post_data.length,
//         },
//       };

//       let response = "";
//       const post_req = https.request(options, (post_res) => {
//         post_res.on("data", (chunk) => {
//           response += chunk;
//         });
//         post_res.on("end", () => {
//           const responseData = JSON.parse(response);
//           setPaymentData({
//             ...paymentData,
//             token: responseData.body.txnToken,
//             order: orderId,
//             mid: mid,
//             amount: 100,
//           });
//           // Here you can trigger the Paytm payment modal with the token
//           console.log("Response: ", response);
//         });
//       });

//       post_req.write(post_data);
//       post_req.end();
//     });
//   };

//   const handlePayNow = () => {
//     // Trigger Paytm checkout modal with the paymentData.token
//     console.log('Pay Now button clicked with token:', paymentData.token);
//   };

//   return (
//     <button onClick={handlePayNow}>
//       Pay Now
//     </button>
//   );
// };

// export default PaytmButton;
