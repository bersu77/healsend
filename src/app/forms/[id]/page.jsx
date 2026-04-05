"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";
import AppIcon from "@/components/ui/AppIcon";

export default function PublicFormPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Form not found");
        return r.json();
      })
      .then((t) => {
        if (!t.active)
          throw new Error("This form is not currently accepting responses");
        setTemplate(t);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf8ff] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <AppIcon
            name="error_outline"
            className="text-5xl text-[#c9c4d8]"
          />
          <p className="text-[#484555]">{error}</p>
          <Link href="/" className="text-[#5b3cdd] font-semibold text-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#fdf8ff] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#5b3cdd] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8ff]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#c9c4d8]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="HealSend"
              width={130}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      <div className="py-12 px-6">
        <DynamicFormRenderer template={template} />
      </div>
    </div>
  );
}
