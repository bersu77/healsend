"use client";

import React, { useRef, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

/**
 * Reusable image upload component with drag-and-drop + click-to-browse.
 *
 * Props:
 *  - value: current image URL (string) or array of URLs (for multi)
 *  - onChange: (url: string | string[]) => void
 *  - multiple: boolean (default false)
 *  - label: string
 *  - className: string
 */
export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  label = "Image",
  hint = "",
  className = "",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const urls = multiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : [];

  const singleUrl = !multiple ? value || "" : "";

  const upload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url } = await res.json();
          uploaded.push(url);
        }
      } catch {
        // skip failed files
      }
    }

    setUploading(false);

    if (multiple) {
      onChange([...urls, ...uploaded]);
    } else if (uploaded.length > 0) {
      onChange(uploaded[0]);
    }
  };

  const handleFileChange = (e) => {
    upload(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(Array.from(e.dataTransfer.files));
  };

  const removeUrl = (urlToRemove) => {
    if (multiple) {
      onChange(urls.filter((u) => u !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-[#484555] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Preview area */}
      {multiple && urls.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {urls.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt=""
                className="w-20 h-20 rounded-lg object-cover border border-[#c9c4d8]/20"
              />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!multiple && singleUrl && (
        <div className="relative group inline-block mb-3">
          <img
            src={singleUrl}
            alt=""
            className="w-24 h-24 rounded-lg object-cover border border-[#c9c4d8]/20"
          />
          <button
            type="button"
            onClick={() => removeUrl(singleUrl)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-[#5b3cdd] bg-[#e5deff]/30"
            : "border-[#c9c4d8]/30 hover:border-[#5b3cdd]/40 bg-white"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-[#5b3cdd]">
            <span className="w-5 h-5 border-2 border-[#5b3cdd]/30 border-t-[#5b3cdd] rounded-full animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : (
          <>
            <AppIcon
              name="cloud_upload"
              className="mx-auto mb-1 block text-[#c9c4d8] text-3xl"
            />
            <p className="text-sm text-[#484555]">
              Drag & drop or{" "}
              <span className="text-[#5b3cdd] font-semibold">browse</span>
            </p>
            <p className="text-xs text-[#797587] mt-1">
              JPEG, PNG, WebP, GIF — max 5 MB
            </p>
          </>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#797587]">
          <AppIcon
            name="straighten"
            className="text-[14px] leading-none shrink-0"
          />
          {hint}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
