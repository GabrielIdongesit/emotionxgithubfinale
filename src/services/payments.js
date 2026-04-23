import API from "./api.js";

export const paymentAPI = {
  // ── Stripe ──
  createStripeIntent: (orderId) =>
    API.post("/payment/stripe/create-intent", { orderId }),

  confirmStripe: (orderId, paymentIntentId) =>
    API.post("/payment/stripe/confirm", { orderId, paymentIntentId }),

  // ── Bitcoin ──
  getBitcoinDetails: (orderId) =>
    API.post("/payment/bitcoin/details", { orderId }),

  confirmBitcoin: (orderId, txHash) =>
    API.post("/payment/bitcoin/confirm", { orderId, txHash }),
};
