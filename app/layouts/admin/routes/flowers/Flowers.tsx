import { useLoaderData, useFetcher } from "react-router";
import { useState, useRef, useCallback } from "react";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { getFlowers } from "../../models/flower";
import {
  FlowerIcon,
  ImageUploadIcon,
  Delete02Icon,
  Cancel01Icon,
} from "hugeicons-react";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const flowers = await getFlowers(db, user.teamId);
  return { flowers, teamId: user.teamId };
}

const occasions = [
  "Birthday",
  "Anniversary",
  "Promotion",
  "Retirement",
  "Holiday",
  "Thank You",
  "Welcome",
  "Get Well",
];
const categories = [
  "Roses",
  "Mixed Bouquet",
  "Tropical",
  "Classic",
  "Premium",
  "Seasonal",
];

export default function Flowers() {
  const { flowers, teamId } = useLoaderData<typeof loader>();
  const [showForm, setShowForm] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  function resetForm() {
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
    setUploadedUrl("");
    setUploadError("");
  }

  function handleFile(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP, and GIF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum 5MB.");
      return;
    }
    setUploadError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setUploadedUrl("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    let imageUrl = "";

    // Upload image first if selected
    if (imageFile) {
      setUploading(true);
      setUploadError("");
      try {
        const uploadFd = new FormData();
        uploadFd.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadFd,
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setUploadError(data.error ?? "Upload failed");
          setUploading(false);
          return;
        }
        imageUrl = data.url;
      } catch (err: any) {
        setUploadError(err.message ?? "Upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Now submit the form via fetcher
    const fd = new FormData(form);
    fd.set("imageUrl", imageUrl);
    fetcher.submit(fd, { method: "post", action: "/api/admin/flowers" });
    resetForm();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Flower Arrangements
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage flower arrangements and service offerings
          </p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Arrangement"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Arrangement
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <input type="hidden" name="teamId" value={teamId} />
            <input type="hidden" name="imageUrl" value="" />

            {/* Image Dropzone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrangement Image
              </label>
              {imagePreview ? (
                <div className="relative w-full h-56 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Cancel01Icon size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-44 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                    dragOver
                      ? "border-rose-400 bg-rose-50"
                      : "border-gray-300 hover:border-rose-300 hover:bg-gray-50"
                  }`}
                >
                  <ImageUploadIcon
                    size={36}
                    className={
                      dragOver ? "text-rose-500" : "text-gray-400"
                    }
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      <span className="text-rose-600">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPEG, PNG, WebP or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  placeholder="e.g., Ecuadorian Rose Bouquet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  placeholder="49.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occasion
                </label>
                <select
                  name="occasion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                >
                  <option value="">Select occasion</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm resize-none"
                  placeholder="Describe the arrangement..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? "Uploading image..."
                  : isSubmitting
                    ? "Creating..."
                    : "Create Arrangement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {flowers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          <FlowerIcon size={40} className="mx-auto mb-3 text-gray-300" />
          <p>
            No flower arrangements yet. Click "Add Arrangement" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flowers.map((flower: any) => (
            <div
              key={flower.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
                {flower.imageUrl ? (
                  <img
                    src={flower.imageUrl}
                    alt={flower.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FlowerIcon size={48} className="text-rose-300" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{flower.name}</h3>
                  <span className="text-lg font-bold text-rose-600">
                    ${flower.price.toFixed(2)}
                  </span>
                </div>
                {flower.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {flower.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  {flower.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {flower.category}
                    </span>
                  )}
                  {flower.occasion && (
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full">
                      {flower.occasion}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${flower.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    {flower.isActive ? "Active" : "Inactive"}
                  </span>
                  <fetcher.Form
                    method="post"
                    action="/api/admin/flowers"
                    className="inline"
                    onSubmit={(e) => {
                      if (!confirm("Delete this arrangement?"))
                        e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={flower.id} />
                    <button
                      type="submit"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Delete02Icon size={16} />
                    </button>
                  </fetcher.Form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
