import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";

import { paymentAPI } from "../services/payments.js";

const BitcoinPaymentPage = ({ orderId, total, onSuccess }) => {
  const [details, setDetails] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data } = await paymentAPI.getBitcoinDetails(orderId);
        setDetails(data.data);
      } catch (err) {
        setError("Could not load Bitcoin details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  const copyAddress = () => {
    navigator.clipboard.writeText(details?.address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!txHash.trim()) {
      setError("Please enter your transaction hash");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await paymentAPI.confirmBitcoin(orderId, txHash);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Confirmation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading BTC details...
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow p-6 flex-1">
      <h2 className="text-lg font-bold mb-1 text-center">Pay with Bitcoin</h2>
      <p className="text-gray-500 text-sm text-center mb-4">Amount: ${total}</p>

      {details && (
        <>
          {/* QR Code via API */}
          <div className="flex justify-center mb-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${details.address}`}
              alt="Bitcoin QR Code"
              className="rounded-lg border"
            />
          </div>
          <p className="text-center text-xs text-gray-500 break-all mb-3">
            {details.address}
          </p>
          <button
            onClick={copyAddress}
            className="w-full border border-gray-300 rounded-lg py-2 text-sm mb-4 hover:bg-gray-50 transition"
          >
            {copied ? "✓ Copied!" : "Copy Address"}
          </button>
        </>
      )}

      <input
        className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
        placeholder="Paste your transaction hash (txid)"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "I Have Sent Payment"}
      </button>
    </div>
  );
};

export default BitcoinPaymentPage;
