import React, { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api/admin";

const CATEGORIES = [
  "Protein",
  "PreWorkout",
  "Creatine",
  "MassGainer",
  "BCAA",
  "Multivitamin",
  "FishOil",
  "Accessories",
];

const emptyForm = {
  pname: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  description: "",
};

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageState, setPageState] = useState("loading"); // loading | loaded | error
  const [loadingMore, setLoadingMore] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async (category = categoryFilter) => {
    setPageState("loading");
    try {
      const params = { limit: 20 };
      if (category) params.category = category;
      const res = await getAdminProducts(params);
      setProducts(res.data.products || []);
      setNextCursor(res.data.nextCursor || null);
      setPageState("loaded");
    } catch (err) {
      console.log(err.response?.data);
      setPageState("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (category) => {
    setCategoryFilter(category);
    load(category);
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const params = { limit: 20, cursor: nextCursor };
      if (categoryFilter) params.category = categoryFilter;
      const res = await getAdminProducts(params);
      setProducts((prev) => [...prev, ...(res.data.products || [])]);
      setNextCursor(res.data.nextCursor || null);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoadingMore(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      pname: product.pname,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setImageFile(null);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !form.pname ||
      !form.category ||
      form.price === "" ||
      form.stock === "" ||
      !form.description
    ) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!editingProduct && !imageFile) {
      setFormError("Please choose a product image.");
      return;
    }

    const fd = new FormData();
    fd.append("pname", form.pname);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);

    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, fd);
      } else {
        await createProduct(fd);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      console.log(err.response?.data);
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.pname}"? This can't be undone.`)) return;
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Could not delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">Add, edit, and manage your catalog.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange("")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            categoryFilter === ""
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handleFilterChange(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === c
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {pageState === "loading" && (
        <div className="w-full py-24 flex items-center justify-center text-neutral-400">
          <Loader2 className="animate-spin" size={26} />
        </div>
      )}

      {pageState === "error" && (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-neutral-900 font-semibold">Couldn't load products.</p>
          <button onClick={() => load()} className="text-sm font-semibold text-blue-600 hover:underline">
            Try again
          </button>
        </div>
      )}

      {pageState === "loaded" && products.length === 0 && (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-neutral-900 font-semibold">No products yet.</p>
          <p className="text-sm text-neutral-500">Add your first product to get started.</p>
        </div>
      )}

      {pageState === "loaded" && products.length > 0 && (
        <>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Stock</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-neutral-100 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#F7F7F7] border border-neutral-200 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.pname}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <p className="font-medium text-neutral-800 truncate max-w-50">
                            {product.pname}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-600 whitespace-nowrap">{product.category}</td>
                      <td className="px-5 py-3 font-semibold text-neutral-900 whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                            product.stock > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === product._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {nextCursor && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-2"
              >
                {loadingMore && <Loader2 size={14} className="animate-spin" />}
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white">
              <h2 className="font-bold text-neutral-900">
                {editingProduct ? "Edit product" : "Add product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-900"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Product name
                </label>
                <input
                  type="text"
                  value={form.pname}
                  onChange={(e) => handleFormChange("pname", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  Image
                  {editingProduct && (
                    <span className="text-neutral-400 font-normal"> (leave empty to keep current)</span>
                  )}
                </label>
                <label className="flex items-center gap-2 border border-dashed border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-500 cursor-pointer hover:border-neutral-400 transition-colors">
                  <ImagePlus size={16} />
                  <span className="truncate">{imageFile ? imageFile.name : "Choose image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-lg py-2.5 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {editingProduct ? "Save changes" : "Create product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
