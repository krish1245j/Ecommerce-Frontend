import React, { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { getOrders, getOrderById, updateOrderStatus } from "./api/admin";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELED"];

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELED: "bg-red-50 text-red-700 border-red-200",
};

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [pageState, setPageState] = useState("loading"); // loading | loaded | error
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async (page = 1) => {
    setPageState("loading");
    try {
      const res = await getOrders(page, 10);
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1 });
      setPageState("loaded");
    } catch (err) {
      console.log(err.response?.data);
      setPageState("error");
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const handleStatusChange = async (order, status) => {
    if (status === order.orderStatus) return;
    setUpdatingId(order._id);
    try {
      const res = await updateOrderStatus(order._id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? res.data.order : o))
      );
      setSelectedOrder((prev) => (prev && prev._id === order._id ? res.data.order : prev));
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = async (id) => {
    setDetailLoading(true);
    setSelectedOrder({ _id: id, __placeholder: true });
    try {
      const res = await getOrderById(id);
      setSelectedOrder(res.data.order);
    } catch (err) {
      console.log(err.response?.data);
      setSelectedOrder(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => setSelectedOrder(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">Track and update order fulfillment.</p>
      </div>

      {pageState === "loading" && (
        <div className="w-full py-24 flex items-center justify-center text-neutral-400">
          <Loader2 className="animate-spin" size={26} />
        </div>
      )}

      {pageState === "error" && (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-neutral-900 font-semibold">Couldn't load orders.</p>
          <button onClick={() => load(1)} className="text-sm font-semibold text-blue-600 hover:underline">
            Try again
          </button>
        </div>
      )}

      {pageState === "loaded" && orders.length === 0 && (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-neutral-900 font-semibold">No orders yet.</p>
          <p className="text-sm text-neutral-500">Orders placed by customers will show up here.</p>
        </div>
      )}

      {pageState === "loaded" && orders.length > 0 && (
        <>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Placed</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-neutral-100 last:border-0">
                      <td className="px-5 py-3 font-medium text-neutral-800 whitespace-nowrap">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-neutral-600 whitespace-nowrap">
                        {order.shippingAddress?.fullName || "—"}
                      </td>
                      <td className="px-5 py-3 text-neutral-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-neutral-900 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border outline-none cursor-pointer disabled:opacity-50 ${
                            STATUS_STYLES[order.orderStatus] ||
                            "bg-neutral-50 text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => openDetails(order._id)}
                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                            aria-label="View details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => load(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="w-9 h-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <p className="text-sm text-neutral-500">
                Page <span className="font-semibold text-neutral-900">{pagination.page}</span> of{" "}
                {pagination.totalPages}
              </p>
              <button
                onClick={() => load(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="w-9 h-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={closeDetails}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white">
              <h2 className="font-bold text-neutral-900">
                Order #{selectedOrder._id.slice(-6).toUpperCase()}
              </h2>
              <button onClick={closeDetails} className="text-neutral-400 hover:text-neutral-900" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {detailLoading || selectedOrder.__placeholder ? (
              <div className="py-20 flex items-center justify-center">
                <Loader2 className="animate-spin text-neutral-400" size={24} />
              </div>
            ) : (
              <div className="px-6 py-5 flex flex-col gap-6">

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      STATUS_STYLES[selectedOrder.orderStatus] ||
                      "bg-neutral-50 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Items
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-800">
                          {item.pname} <span className="text-neutral-400">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-neutral-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mt-3 pt-3 border-t border-neutral-100">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Shipping address
                  </h3>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    {selectedOrder.shippingAddress.fullName}
                    <br />
                    {selectedOrder.shippingAddress.address}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} —{" "}
                    {selectedOrder.shippingAddress.pincode}
                    <br />
                    {selectedOrder.shippingAddress.phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Payment
                    </p>
                    <p className="text-neutral-800 font-medium">
                      {selectedOrder.paymentMethod} · {selectedOrder.paymentStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Update status
                    </p>
                    <select
                      value={selectedOrder.orderStatus}
                      disabled={updatingId === selectedOrder._id}
                      onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
                      className="text-sm font-medium border border-neutral-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
