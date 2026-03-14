import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const BitcoinPaymentPage = () => {
const location = useLocation();
const navigate = useNavigate();

const totalAmount = location.state?.totalAmount;

// 🔴 Replace with your real Bitcoin wallet
const bitcoinAddress = "bc1qj3um33d0hclqs4v7cwlyn3c2ekv37q9xf8yzcs";

const handleCopy = () => {
navigator.clipboard.writeText(bitcoinAddress);
alert("Bitcoin address copied!");
};

if (!totalAmount) {
return ( <div className="text-center mt-10"> <h2>No order found</h2>
<button
onClick={() => navigate("/cart")}
className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
>
Back to Cart </button> </div>
);
}

const bitcoinURI = `bitcoin:${bitcoinAddress}?amount=${totalAmount}`;

return ( <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center"> <h2 className="text-2xl font-bold mb-4">Pay with Bitcoin</h2>


  <p className="mb-4 font-semibold">
    Amount: ${totalAmount.toFixed(2)}
  </p>

  <div className="flex justify-center mb-4">
    <QRCodeCanvas value={bitcoinURI} size={200} />
  </div>

  <p className="break-all text-sm mb-3">
    {bitcoinAddress}
  </p>

  <button
    onClick={handleCopy}
    className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
  >
    Copy Address
  </button>

  <button
    onClick={() => navigate("/success")}
    className="w-full bg-green-600 text-white py-2 rounded"
  >
    I Have Sent Payment
  </button>
</div>


);
};

export default BitcoinPaymentPage;
