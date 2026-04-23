import React, { useState, useEffect } from "react";
import { productAPI } from "../services/products.js";
import { useCart } from "../context/CartContext";

const Bike = ({ searchTerm, setSelectedProduct }) => {
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]); // master list from API
  const [bikes, setBikes] = useState([]); // filtered display list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("All");
  const [activePrice, setActivePrice] = useState(null);
  const [addingId, setAddingId] = useState(null); // track which item is being added

  // ── Fetch all products from backend on mount ──────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll();

        const products = Array.isArray(res.data?.output) ? res.data.output : [];
        setAllProducts(products);
        setBikes(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Re-apply filters whenever master list or active filters change ──
  useEffect(() => {
    let filtered = [...allProducts];

    if (activeType !== "All") {
      filtered = filtered.filter(
        (item) => item.category === activeType || item.type === activeType,
      );
    }

    if (activePrice !== null) {
      filtered = filtered.filter(
        (item) => Number(item.price) <= Number(activePrice),
      );
    }

    setBikes(filtered);
  }, [allProducts, activeType, activePrice]);

  // ── Search filter (applied on top of type/price filters) ─────
  const filteredBikes = bikes.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  // ── Derive unique categories dynamically from API data ────────
  const categories = [
    "All",
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ];

  // ── Derive price buckets dynamically from API data ────────────
  const priceBuckets = [...new Set(allProducts.map((p) => Number(p.price)))]
    .filter(Boolean)
    .sort((a, b) => a - b);

  // ── Helpers ───────────────────────────────────────────────────
  const formatPrice = (price) => {
    const num = Number(price);
    if (!num && num !== 0) return "$0";
    return `$${num.toLocaleString("en-US")}`;
  };

  const handleFilterType = (type) => {
    setActiveType(type);
    setActivePrice(null); // reset price filter when type changes
  };

  const handleFilterPrice = (price) => {
    setActivePrice(price === activePrice ? null : price); // toggle off if same
  };

  const handleAddToCart = async (item) => {
    try {
      setAddingId(item._id);
      await addToCart(item._id, 1);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingId(null);
    }
  };

  const shareOnWhatsApp = (item) => {
    const message = `🔥 ${item.name}\nPrice: ${formatPrice(item.price)}\n\n${item.description}\n\nCheck it out!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // ── Render states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1640px] m-auto px-4 py-12 text-center">
        <h1 className="text-teal-600 font-bold text-4xl mb-8">
          Top Rated Electric Bikes
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1640px] m-auto px-4 py-12 text-center">
        <h1 className="text-teal-600 font-bold text-4xl mb-6">
          Top Rated Electric Bikes
        </h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1640px] m-auto px-4 py-12">
      <h1 className="text-teal-600 font-bold text-4xl text-center">
        Top Rated Electric Bikes
      </h1>

      {/* ── Filters ── */}
      <div className="flex flex-col lg:flex-row justify-between mt-6">
        {/* Type filter — built dynamically from API */}
        <div>
          <p className="font-bold text-gray-700">Filter Type</p>
          <div className="flex flex-wrap mt-2">
            {categories.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterType(type)}
                className={`border px-5 py-1 rounded-md m-1 transition ${
                  activeType === type
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price filter — built dynamically from API */}
        <div className="mt-4 lg:mt-0">
          <p className="font-bold text-gray-700">Filter Price</p>
          <div className="flex flex-wrap mt-2">
            {priceBuckets.map((price, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterPrice(price)}
                className={`border px-5 py-1 rounded-md m-1 transition ${
                  activePrice === price
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                }`}
              >
                {formatPrice(price)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {filteredBikes.length > 0 ? (
          filteredBikes.map((item) => (
            <div
              key={item._id}
              className="border shadow-2xl rounded-lg overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-48 overflow-hidden bg-gray-50">
                <img
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                  src={item.image || "/placeholder-bike.png"}
                  alt={item.name}
                  onClick={() => setSelectedProduct(item)}
                  onError={(e) => {
                    e.target.src = "/placeholder-bike.png";
                  }}
                />
              </div>

              {/* Name + Price */}
              <div className="flex justify-between items-center px-2 py-4">
                <p className="font-bold text-sm">{item.name}</p>
                <span className="bg-teal-500 text-white px-2 py-0.5 rounded-full text-sm whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 px-2 pb-2 text-sm line-clamp-2 flex-1">
                {item.description}
              </p>

              {/* Actions */}
              <div className="flex mt-auto">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={addingId === item._id}
                  className="bg-teal-500 text-white w-full py-2 hover:bg-teal-600 disabled:opacity-60 transition text-sm"
                >
                  {addingId === item._id ? "Adding..." : "Add To Cart"}
                </button>
                <button
                  onClick={() => shareOnWhatsApp(item)}
                  className="bg-green-500 text-white w-full py-2 hover:bg-green-600 transition text-sm"
                >
                  Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-12">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Bike;
