import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";

import { paymentAPI } from "../services/payments.js";

const BitcoinPaymentPage = ({ orderId, total, onSuccess }) => {
  const BTC_ADDRESS =
    process.env.REACT_APP_BITCOIN_ADDRESS || "bc1xxxxxxxxxxxxxxxxxxxxxxxxx";

  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showTxInput, setShowTxInput] = useState(false);
  const [error, setError] = useState(null);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${BTC_ADDRESS}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirm = async () => {
    if (!txHash.trim()) {
      setError("Please paste your Transaction ID (txid)");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await paymentAPI.confirmBitcoin(orderId, txHash.trim());
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 rounded-2xl shadow flex-1 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-1">Pay with Bitcoin</h2>
        <p className="text-gray-500 text-sm mb-6">Amount: ${total}</p>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <img
            src={qrUrl}
            alt="Bitcoin QR Code"
            className="rounded-lg border"
            width={180}
            height={180}
          />
        </div>

        {/* BTC Address */}
        <p className="text-xs text-gray-500 break-all mb-5 px-2">
          {BTC_ADDRESS}
        </p>

        {/* Copy Address */}
        <button
          onClick={handleCopy}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg mb-3 transition"
        >
          {copied ? "✓ Copied!" : "Copy Address"}
        </button>

        {/* I Have Sent Payment → reveals tx input */}
        {!showTxInput ? (
          <button
            onClick={() => setShowTxInput(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
          >
            I Have Sent Payment
          </button>
        ) : (
          <div className="mt-2 text-left">
            <label className="text-xs text-gray-500 mb-1 block">
              Paste your Transaction ID (txid) to confirm:
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. a1b2c3d4e5f6..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Confirm Payment"}
            </button>
            <button
              onClick={() => {
                setShowTxInput(false);
                setError(null);
              }}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BitcoinPaymentPage;
