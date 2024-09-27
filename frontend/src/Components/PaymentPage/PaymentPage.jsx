// import React, { useState, useContext } from 'react';
// import { QRCodeCanvas } from 'qrcode.react';
// import { AuthContext } from '../../Context/AuthContext';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import './PaymentPage.css'; // Make sure this is imported
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// const PaymentPage = () => {
//   const amount = useLocation().state.amount;
//   const [transactionId, setTransactionId] = useState('');
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const upiID = "atharvashibe2005-2@okaxis"; // Your UPI ID
//   const name = "Atharva shibe"; // Your name for the payment
//   const { user } = useContext(AuthContext);
//   const userId = user ? user._id : null;
// //   const email = user ? user.email : null;


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:4000/confirm', {
//         // transactionId,
//         amount,
//         userId,
//       });
//       setConfirmationMessage(response.data.message);
//       alert("Payment done");
//     } catch (error) {
//       setConfirmationMessage('Failed to confirm payment. Please try again.');
//     }
//   };

//   return (
//     <div className="payment-page-container"> {/* Add this class */}
//       <div className="container">
//         <h2>Pay Now</h2>
//         <p>Scan the QR code below to pay ₹{amount}</p>

//         <QRCodeCanvas value={upiPaymentURL} size={200} className="qr-code" />

//         <form onSubmit={handleSubmit} className="payment-form">
//           <label>Transaction ID:</label>
//           <input
//             type="text"
//             value={transactionId}
//             onChange={(e) => setTransactionId(e.target.value)}
//             required
//           />
//           <button type="submit">Confirm Payment</button>
//         </form>

//         {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useState, useContext } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './PaymentPage.css'; // Make sure this is imported
import tick from '../Animation - 1727459193500.json';
import Lottie from 'lottie-react';

const PaymentPage = () => {
  const amount = useLocation().state.amount;
  const [transactionId, setTransactionId] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(false);
  const upiID = "atharvashibe2005-2@okaxis"; // Your UPI ID
  const name = "Atharva shibe"; // Your name for the payment
  const { user } = useContext(AuthContext);
  const userId = user ? user._id : null;
  //   const email = user ? user.email : null;
  // const upiPaymentURL = upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR;
    const upiPaymentURL = `upi://pay?pa=${upiID}&pn=${name}&am=${amount}&cu=INR`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/confirm', {
        // transactionId,
        amount,
        userId,
      });
      setConfirmationMessage(response.data.message);
      alert("Payment done");
    } catch (error) {
      setConfirmationMessage('Failed to confirm payment. Please try again.');
    }
  };

  return (
    <div className="payment-page-container"> {/* Add this class */}
      {!paymentStatus &&
        <div className="container">
          <h2>Pay Now</h2>
          <p>Scan the QR code below to pay ₹{amount}</p>
          <QRCodeCanvas value={upiPaymentURL} size={200} className="qr-code" />
          <form onSubmit={handleSubmit} className="payment-form">
            <label>Transaction ID:</label>
            <input
              
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
            <button onClick={() => setPaymentStatus(true)} type="submit">Confirm Payment</button>
          </form>
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>}
      {paymentStatus &&
        <div className="container">
          <h2>Payment Successful</h2>
         <Lottie animationData={tick}/>
          <p>Thank you for your payment of ₹{amount}</p>
        </div>}
    </div>
  );
};

export default PaymentPage;
