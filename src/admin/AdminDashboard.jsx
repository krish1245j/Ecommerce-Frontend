import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { getDashboard, getOrders, getUsers, changeUserStatus } from "./api/admin";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELED: "bg-red-50 text-red-700 border-red-200",
};

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageState, setPageState] = useState("loading"); // loading | loaded | error
  const [userActionId, setUserActionId] = useState(null);

  const load = async () => {
    setPageState("loading");
    try {
      const [dashRes, ordersRes, usersRes] = await Promise.all([
        getDashboard(),
        getOrders(1, 5),
        getUsers(1, 5),
      ]);
      setStats(dashRes.data);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setPageState("loaded");
    } catch (err) {
      console.log(err.response?.data);
      setPageState("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleBlock = async (user) => {
    setUserActionId(user._id);
    try {
      await changeUserStatus(user._id, !user.isBlocked);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setUserActionId(null);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="w-full py-24 flex items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin" size={26} />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3">
        <p className="text-neutral-900 font-semibold">Couldn't load the dashboard.</p>
        <button onClick={load} className="text-sm font-semibold text-blue-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  const statCards = [
    { label: "Total orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Total users", value: stats.totalUser, icon: Users },
    { label: "Total products", value: stats.totalProducts, icon: Package },
    { label: "Revenue (delivered)", value: formatCurrency(stats.totalRevenue), icon: IndianRupee },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">A quick look at how the store is doing.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-xl p-5 flex items-start justify-between"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {label}
              </p>
              <p className="text-2xl font-extrabold text-neutral-900 mt-2 truncate">
                {value}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* RECENT ORDERS */}
        <div className="xl:col-span-3 bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-neutral-400 px-5 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-neutral-100 last:border-0">
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-neutral-700">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            STATUS_STYLES[order.orderStatus] ||
                            "bg-neutral-50 text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECENT USERS */}
        <div className="xl:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">Recent users</h2>
          </div>

          {users.length === 0 ? (
            <p className="text-sm text-neutral-400 px-5 py-8 text-center">No users yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {users.map((user) => (
                <li key={user._id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{user.username}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleToggleBlock(user)}
                    disabled={userActionId === user._id}
                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 ${
                      user.isBlocked
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {userActionId === user._id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : user.isBlocked ? (
                      "Blocked"
                    ) : (
                      "Active"
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
