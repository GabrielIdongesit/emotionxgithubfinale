// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { orderAPI } from "../services/orders.js";
import { productAPI } from "../services/products.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    type: "bike",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
        ]);
        // Normalize: always store arrays regardless of response shape
        const ordersData =
          ordersRes.data?.output ?? ordersRes.data?.data ?? ordersRes.data;
        const productsData =
          productsRes.data?.output ??
          productsRes.data?.data ??
          productsRes.data;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalProductsSold = orders
    .filter((o) => o.paymentStatus === "paid")
    .flatMap((o) => o.items)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Build chart data: group paid orders by month
  const salesByMonth = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => {
      const month = new Date(o.createdAt).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + o.totalAmount;
      return acc;
    }, {});
  const chartData = Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    total,
  }));

  // Top products by revenue
  const productRevenue = {};
  orders
    .filter((o) => o.paymentStatus === "paid")
    .forEach((o) => {
      o.items.forEach((item) => {
        productRevenue[item.name] =
          (productRevenue[item.name] || 0) + item.price * item.quantity;
      });
    });
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.description) return;
    setAdding(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const { data } = await productAPI.create(fd);
      const newProduct = data?.output ?? data?.data ?? data;
      setProducts((prev) => [newProduct, ...(Array.isArray(prev) ? prev : [])]);
      setForm({
        name: "",
        price: "",
        description: "",
        type: "bike",
        category: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error("Add product error:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleClearOrders = async () => {
    if (!window.confirm("Clear all orders? This cannot be undone.")) return;
    // You can add a clear-all endpoint, or just refetch
    setOrders([]);
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o)),
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleClearOrders}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Clear Orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            color: "text-green-500",
          },
          { label: "Total Orders", value: orders.length, color: "text-black" },
          {
            label: "Products Sold",
            value: totalProductsSold,
            color: "text-black",
          },
          { label: "Total Users Logged In", value: 1, color: "text-blue-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Sales Overview (Bar Chart)</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(val) => `$${val}`} />
              <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">No sales data yet</p>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Top Product Revenue</h2>
        {topProducts.length > 0 ? (
          <ul className="divide-y">
            {topProducts.map(([name, rev]) => (
              <li key={name} className="flex justify-between py-2 text-sm">
                <span>{name}</span>
                <span className="font-semibold">${rev.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No product data</p>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Order ID</th>
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Total</th>
                  <th className="pb-2 pr-4">Payment</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-2 pr-4 text-xs text-gray-400">
                      {order._id.slice(-6)}
                    </td>
                    <td className="py-2 pr-4">{order.user?.fullName || "—"}</td>
                    <td className="py-2 pr-4">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-2 pr-4 capitalize">
                      {order.paymentStatus}
                    </td>
                    <td className="py-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >
                        {[
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No orders yet</p>
        )}
      </div>

      {/* Manage Products */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-lg mb-4">Manage Products</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px]"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="border rounded-lg px-3 py-2 text-sm w-28"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <textarea
            className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
            placeholder="Description"
            rows={1}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="bike">Bike</option>
            <option value="spare">Spare</option>
          </select>
          <input
            className="border rounded-lg px-3 py-2 text-sm w-32"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button
            onClick={handleAddProduct}
            disabled={adding}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Product"}
          </button>
        </div>

        {/* Product List */}
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">${p.price}</td>
                    <td className="py-2 pr-4 capitalize">{p.type}</td>
                    <td className="py-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/${p._id}/edit`)
                        }
                        className="text-blue-500 hover:underline mr-3 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          await productAPI.delete(p._id);
                          setProducts((prev) =>
                            (Array.isArray(prev) ? prev : []).filter(
                              (x) => x._id !== p._id,
                            ),
                          );
                        }}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No products added yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
