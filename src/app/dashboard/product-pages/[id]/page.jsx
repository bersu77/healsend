"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import AppIcon from "@/components/ui/AppIcon";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function str(value) {
  return String(value || "").trim();
}

// ─── Detail page (product.attributes.detailPage) ────────────────────────────

function normalizeDetailForm(detailPage, product) {
  const detail = asObject(detailPage);

  const defaultHowSteps = [
    {
      title: "Initial Consultation",
      desc: "Complete your online medical questionnaire.",
      icon: "medical_services",
    },
    {
      title: "Provider Review",
      desc: "A licensed provider reviews and prescribes if appropriate.",
      icon: "person_search",
    },
    {
      title: "Medication Delivered",
      desc: "Your medication ships from a licensed pharmacy.",
      icon: "local_shipping",
    },
  ];

  const defaultSafetyItems = [
    {
      title: "Important Safety Information",
      body: "This treatment requires a prescription and provider review.",
      icon: "warning",
      colorClass: "text-amber-500",
    },
    {
      title: "Side Effects",
      body: "Consult your provider if you experience side effects.",
      icon: "info",
      colorClass: "text-blue-500",
    },
  ];

  return {
    overviewTitle:
      String(detail.overviewTitle || "").trim() || "About This Treatment",
    overviewBody:
      String(detail.overviewBody || "").trim() ||
      String(product?.description || "").trim(),
    benefitsTitle: String(detail.benefitsTitle || "").trim() || "Key Benefits",
    benefits:
      Array.isArray(detail.benefits) && detail.benefits.length > 0
        ? detail.benefits
            .map((item) => String(item || "").trim())
            .filter(Boolean)
        : [],
    beforeAfterTitle:
      String(detail.beforeAfterTitle || "").trim() || "Before & After Results",
    beforeAfterAutoMs:
      Number.parseInt(String(detail.beforeAfterAutoMs || "3000"), 10) || 3000,
    beforeAfterSlides: Array.isArray(detail.beforeAfterSlides)
      ? detail.beforeAfterSlides.map((slide) => {
          const item = asObject(slide);
          return {
            label: String(item.label || "").trim(),
            caption: String(item.caption || "").trim(),
            image: String(item.image || "").trim(),
          };
        })
      : [],
    howTitle: String(detail.howTitle || "").trim() || "How It Works",
    howSteps:
      Array.isArray(detail.howSteps) && detail.howSteps.length > 0
        ? detail.howSteps.map((step) => {
            const item = asObject(step);
            return {
              title: String(item.title || "").trim(),
              desc: String(item.desc || item.description || "").trim(),
              icon: String(item.icon || "medical_services").trim(),
            };
          })
        : defaultHowSteps,
    safetyTitle:
      String(detail.safetyTitle || "").trim() || "Safety Information",
    safetyItems:
      Array.isArray(detail.safetyItems) && detail.safetyItems.length > 0
        ? detail.safetyItems.map((entry) => {
            const item = asObject(entry);
            return {
              title: String(item.title || "").trim(),
              body: String(item.body || "").trim(),
              icon: String(item.icon || "info").trim(),
              colorClass: String(item.colorClass || "text-blue-500").trim(),
            };
          })
        : defaultSafetyItems,
  };
}

// ─── Marketing page (marketingPage.content) ─────────────────────────────────

function normalizeMarketingForm(content) {
  const c = asObject(content);
  const tabs = asObject(c.tabs);
  const featureSection = asObject(c.featureSection);
  const supportSection = asObject(c.supportSection);
  const comprehensiveCare = asObject(c.comprehensiveCare);
  const closingCta = asObject(c.closingCta);

  return {
    // Tabs
    tabsBenefits: asArray(tabs.benefits).map((item) => ({
      iconName: str(asObject(item).iconName) || "Sparkles",
      text: str(asObject(item).text),
    })),
    tabsDescription: str(tabs.description),

    // FAQs
    faqs: asArray(c.faqs).map((item) => ({
      question: str(asObject(item).question),
      answer: str(asObject(item).answer),
    })),

    // Testimonials
    testimonials: asArray(c.testimonials).map((item) => ({
      name: str(asObject(item).name),
      role: str(asObject(item).role) || "Verified member",
      quote: str(asObject(item).quote),
      highlight: str(asObject(item).highlight),
    })),

    // Pricing highlights
    pricingHighlights: asArray(c.pricingHighlights)
      .map((item) => str(item))
      .filter(Boolean),

    // Clean ingredients
    cleanIngredients: asArray(c.cleanIngredients).map((item) => ({
      iconName: str(asObject(item).iconName) || "Leaf",
      title: str(asObject(item).title || asObject(item).name),
    })),

    // Simple steps
    simpleSteps: asArray(c.simpleSteps).map((item) => ({
      title: str(asObject(item).title),
      step: str(asObject(item).step),
      description: str(asObject(item).description),
      image: str(asObject(item).image),
    })),

    // Benefits carousel title
    benefitsCarouselTitle: str(c.benefitsCarouselTitle),

    // Feature section
    featureSectionTitle: str(featureSection.title),
    featureSectionDescription: asArray(featureSection.description)
      .map((line) => str(line))
      .filter(Boolean)
      .join("\n"),
    featureSectionImage: str(featureSection.image),

    // Support section
    supportSectionTitle: str(supportSection.title),
    supportSectionSubtitle: str(supportSection.subtitle),
    supportSectionFeatures: asArray(supportSection.features).map((item) => ({
      iconName: str(asObject(item).iconName) || "Sparkles",
      title: str(asObject(item).title),
      description: str(asObject(item).description),
    })),

    // Comprehensive care
    comprehensiveCareTitle: str(comprehensiveCare.title),
    comprehensiveCareDescription: str(comprehensiveCare.description),
    comprehensiveCareCtaText: str(comprehensiveCare.ctaText),

    // Closing CTA
    closingCtaEyebrow: str(closingCta.eyebrow),
    closingCtaTitle: str(closingCta.title),
    closingCtaDescription: str(closingCta.description),
    closingCtaBullets: asArray(closingCta.bullets)
      .map((item) => str(item))
      .filter(Boolean),
    closingCtaPlanLabel: str(closingCta.planLabel),
    closingCtaSupportNote: str(closingCta.supportNote),
  };
}

export default function ProductDetailContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(null);
  const [marketingForm, setMarketingForm] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const [productRes, marketingRes] = await Promise.all([
          fetch(`/api/products/${productId}`, { credentials: "include" }),
          fetch(`/api/marketing-pages/product/${productId}`, {
            credentials: "include",
          }),
        ]);

        if (!productRes.ok) {
          throw new Error("Failed to load product");
        }

        const productData = await productRes.json();
        const marketingData = marketingRes.ok ? await marketingRes.json() : {};

        if (!isMounted) return;

        // The products API returns the product object at root level
        const entity = productData?.id ? productData : null;
        setProduct(entity);
        setForm(
          normalizeDetailForm(asObject(entity?.attributes).detailPage, entity),
        );
        setMarketingForm(normalizeMarketingForm(marketingData?.content || {}));
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load product");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const canRenderEditor =
    !loading && !error && product && form && marketingForm;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setForm((prev) => {
      const next = [...(prev[field] || [])];
      next[index] = {
        ...(next[index] || {}),
        [key]: value,
      };
      return {
        ...prev,
        [field]: next,
      };
    });
  };

  const addArrayItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const updateMField = (field, value) => {
    setMarketingForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMArrayItem = (field, index, key, value) => {
    setMarketingForm((prev) => {
      const next = [...(prev[field] || [])];
      next[index] = { ...(next[index] || {}), [key]: value };
      return { ...prev, [field]: next };
    });
  };

  const addMArrayItem = (field, item) => {
    setMarketingForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }));
  };

  const removeMArrayItem = (field, index) => {
    setMarketingForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const sanitizedDetailPage = useMemo(() => {
    if (!form) return null;

    return {
      overviewTitle: form.overviewTitle.trim(),
      overviewBody: form.overviewBody.trim(),
      benefitsTitle: form.benefitsTitle.trim(),
      benefits: form.benefits
        .map((item) => String(item || "").trim())
        .filter(Boolean),
      beforeAfterTitle: form.beforeAfterTitle.trim(),
      beforeAfterAutoMs: Math.max(1800, Number(form.beforeAfterAutoMs) || 3000),
      beforeAfterSlides: form.beforeAfterSlides
        .map((item) => ({
          label: String(item?.label || "").trim(),
          caption: String(item?.caption || "").trim(),
          image: String(item?.image || "").trim(),
        }))
        .filter((item) => item.image),
      howTitle: form.howTitle.trim(),
      howSteps: form.howSteps
        .map((item) => ({
          title: String(item?.title || "").trim(),
          desc: String(item?.desc || "").trim(),
          icon: String(item?.icon || "medical_services").trim(),
        }))
        .filter((item) => item.title && item.desc),
      safetyTitle: form.safetyTitle.trim(),
      safetyItems: form.safetyItems
        .map((item) => ({
          title: String(item?.title || "").trim(),
          body: String(item?.body || "").trim(),
          icon: String(item?.icon || "info").trim(),
          colorClass: String(item?.colorClass || "text-blue-500").trim(),
        }))
        .filter((item) => item.title && item.body),
    };
  }, [form]);

  const sanitizedMarketingContent = useMemo(() => {
    if (!marketingForm) return null;
    const mf = marketingForm;

    return {
      tabs: {
        benefits: mf.tabsBenefits
          .map((item) => ({
            iconName: item.iconName.trim(),
            text: item.text.trim(),
          }))
          .filter((item) => item.text),
        description: mf.tabsDescription.trim(),
      },
      faqs: mf.faqs
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter((item) => item.question && item.answer),
      testimonials: mf.testimonials
        .map((item) => ({
          name: item.name.trim(),
          role: item.role.trim() || "Verified member",
          quote: item.quote.trim(),
          highlight: item.highlight.trim(),
        }))
        .filter((item) => item.name && item.quote),
      pricingHighlights: mf.pricingHighlights
        .map((s) => s.trim())
        .filter(Boolean),
      cleanIngredients: mf.cleanIngredients
        .map((item) => ({
          iconName: item.iconName.trim(),
          title: item.title.trim(),
        }))
        .filter((item) => item.title),
      simpleSteps: mf.simpleSteps
        .map((item) => ({
          title: item.title.trim(),
          step: item.step.trim(),
          description: item.description.trim(),
          image: item.image.trim(),
        }))
        .filter((item) => item.title),
      benefitsCarouselTitle: mf.benefitsCarouselTitle.trim() || undefined,
      featureSection: {
        title: mf.featureSectionTitle.trim(),
        description: mf.featureSectionDescription
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        image: mf.featureSectionImage.trim(),
      },
      supportSection: {
        title: mf.supportSectionTitle.trim(),
        subtitle: mf.supportSectionSubtitle.trim(),
        features: mf.supportSectionFeatures
          .map((item) => ({
            iconName: item.iconName.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
          }))
          .filter((item) => item.title),
      },
      comprehensiveCare: {
        title: mf.comprehensiveCareTitle.trim(),
        description: mf.comprehensiveCareDescription.trim(),
        ctaText: mf.comprehensiveCareCtaText.trim(),
      },
      closingCta: {
        eyebrow: mf.closingCtaEyebrow.trim(),
        title: mf.closingCtaTitle.trim(),
        description: mf.closingCtaDescription.trim(),
        bullets: mf.closingCtaBullets.map((s) => s.trim()).filter(Boolean),
        planLabel: mf.closingCtaPlanLabel.trim(),
        supportNote: mf.closingCtaSupportNote.trim(),
      },
    };
  }, [marketingForm]);

  const saveChanges = async () => {
    if (!product || !sanitizedDetailPage || !sanitizedMarketingContent) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const currentAttributes = asObject(product.attributes);
      const nextAttributes = {
        ...currentAttributes,
        detailPage: sanitizedDetailPage,
      };

      const [productRes, marketingRes] = await Promise.all([
        fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            regularPrice:
              product.regularPrice != null
                ? Number(product.regularPrice)
                : null,
            salePrice:
              product.salePrice != null ? Number(product.salePrice) : null,
            stock: Number(product.stock || 0),
            sku: product.sku || "",
            categoryId: product.categoryId,
            images: Array.isArray(product.images) ? product.images : [],
            published: Boolean(product.published),
            inStock:
              product.inStock !== undefined ? Boolean(product.inStock) : true,
            attributes: nextAttributes,
          }),
        }),
        fetch(`/api/marketing-pages/product/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: sanitizedMarketingContent }),
        }),
      ]);

      if (!productRes.ok) {
        const data = await productRes.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save product");
      }

      if (!marketingRes.ok) {
        const data = await marketingRes.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save marketing content");
      }

      const productData = await productRes.json();
      setProduct(productData?.id ? productData : product);
      setSuccess("Product detail page content saved.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7f7892]">
              Product Content CMS
            </p>
            <h1 className="mt-1 font-headline text-2xl font-bold text-[#1c1a24] md:text-3xl">
              {product?.name || "Product Detail Editor"}
            </h1>
            <p className="mt-2 text-sm text-[#484555]">
              Control tab content and before/after media for this product detail
              page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/product-pages"
              className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
            >
              <AppIcon name="arrow_back" className="text-[16px]" />
              Back
            </Link>
            {product?.slug ? (
              <button
                type="button"
                onClick={() => router.push(`/shop/${product.slug}`)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
              >
                <AppIcon name="open_in_new" className="text-[16px]" />
                Preview
              </button>
            ) : null}
            <button
              type="button"
              onClick={saveChanges}
              disabled={saving || !canRenderEditor}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5b3cdd] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AppIcon name="save" className="text-[16px]" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="mt-4 text-sm text-emerald-600">{success}</p>
        ) : null}
      </header>

      {loading ? (
        <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6 text-sm text-[#6b6778]">
          Loading editor...
        </section>
      ) : null}

      {canRenderEditor ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Overview Tab
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={form.overviewTitle}
                    onChange={(e) =>
                      updateField("overviewTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Body
                  </span>
                  <textarea
                    value={form.overviewBody}
                    onChange={(e) =>
                      updateField("overviewBody", e.target.value)
                    }
                    rows={5}
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Before/After Slider
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-[#403d4c]">
                      Section Title
                    </span>
                    <input
                      value={form.beforeAfterTitle}
                      onChange={(e) =>
                        updateField("beforeAfterTitle", e.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-[#403d4c]">
                      Mobile Auto Slide (ms)
                    </span>
                    <input
                      value={form.beforeAfterAutoMs}
                      onChange={(e) =>
                        updateField("beforeAfterAutoMs", e.target.value)
                      }
                      type="number"
                      min="1000"
                      step="100"
                      className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  {form.beforeAfterSlides.map((slide, index) => (
                    <div
                      key={`slide-${index}`}
                      className="rounded-lg border border-[#e8e3f2] p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-3">
                        <input
                          value={slide.label}
                          onChange={(e) =>
                            updateArrayItem(
                              "beforeAfterSlides",
                              index,
                              "label",
                              e.target.value,
                            )
                          }
                          placeholder="Label (e.g. Week 4)"
                          className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                        />
                        <input
                          value={slide.caption}
                          onChange={(e) =>
                            updateArrayItem(
                              "beforeAfterSlides",
                              index,
                              "caption",
                              e.target.value,
                            )
                          }
                          placeholder="Caption"
                          className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("beforeAfterSlides", index)
                          }
                          className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        value={slide.image}
                        onChange={(e) =>
                          updateArrayItem(
                            "beforeAfterSlides",
                            index,
                            "image",
                            e.target.value,
                          )
                        }
                        placeholder="Image URL"
                        className="mt-3 h-10 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("beforeAfterSlides", {
                        label: "",
                        caption: "",
                        image: "",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                  >
                    <AppIcon name="add" className="text-[16px]" />
                    Add Slide
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Key Benefits
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={form.benefitsTitle}
                    onChange={(e) =>
                      updateField("benefitsTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <div className="space-y-3">
                  {form.benefits.map((benefit, index) => (
                    <div key={`benefit-${index}`} className="flex gap-2">
                      <input
                        value={benefit}
                        onChange={(e) => {
                          const next = [...form.benefits];
                          next[index] = e.target.value;
                          updateField("benefits", next);
                        }}
                        className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("benefits", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("benefits", "")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                  >
                    <AppIcon name="add" className="text-[16px]" />
                    Add Benefit
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                How It Works
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={form.howTitle}
                    onChange={(e) => updateField("howTitle", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                {form.howSteps.map((step, index) => (
                  <div
                    key={`step-${index}`}
                    className="rounded-lg border border-[#e8e3f2] p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={step.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "howSteps",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Step title"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={step.icon}
                        onChange={(e) =>
                          updateArrayItem(
                            "howSteps",
                            index,
                            "icon",
                            e.target.value,
                          )
                        }
                        placeholder="Material icon name"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("howSteps", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={step.desc}
                      onChange={(e) =>
                        updateArrayItem(
                          "howSteps",
                          index,
                          "desc",
                          e.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Step description"
                      className="mt-3 w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("howSteps", {
                      title: "",
                      desc: "",
                      icon: "medical_services",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" />
                  Add Step
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Safety Tab
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={form.safetyTitle}
                    onChange={(e) => updateField("safetyTitle", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                {form.safetyItems.map((item, index) => (
                  <div
                    key={`safety-${index}`}
                    className="rounded-lg border border-[#e8e3f2] p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-4">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "safetyItems",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Item title"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={item.icon}
                        onChange={(e) =>
                          updateArrayItem(
                            "safetyItems",
                            index,
                            "icon",
                            e.target.value,
                          )
                        }
                        placeholder="Icon"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={item.colorClass}
                        onChange={(e) =>
                          updateArrayItem(
                            "safetyItems",
                            index,
                            "colorClass",
                            e.target.value,
                          )
                        }
                        placeholder="Color class"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("safetyItems", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={item.body}
                      onChange={(e) =>
                        updateArrayItem(
                          "safetyItems",
                          index,
                          "body",
                          e.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Body"
                      className="mt-3 w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("safetyItems", {
                      title: "",
                      body: "",
                      icon: "info",
                      colorClass: "text-blue-500",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" />
                  Add Safety Item
                </button>
              </div>
            </section>

            {/* ── FAQs ─────────────────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                FAQs
              </h2>
              <div className="mt-4 space-y-3">
                {marketingForm.faqs.map((faq, index) => (
                  <div
                    key={`faq-${index}`}
                    className="rounded-lg border border-[#e8e3f2] p-4 space-y-3"
                  >
                    <div className="flex gap-2">
                      <input
                        value={faq.question}
                        onChange={(e) =>
                          updateMArrayItem(
                            "faqs",
                            index,
                            "question",
                            e.target.value,
                          )
                        }
                        placeholder="Question"
                        className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeMArrayItem("faqs", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        updateMArrayItem(
                          "faqs",
                          index,
                          "answer",
                          e.target.value,
                        )
                      }
                      rows={3}
                      placeholder="Answer"
                      className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addMArrayItem("faqs", { question: "", answer: "" })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" /> Add FAQ
                </button>
              </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Testimonials
              </h2>
              <div className="mt-4 space-y-3">
                {marketingForm.testimonials.map((testimonial, index) => (
                  <div
                    key={`testimonial-${index}`}
                    className="rounded-lg border border-[#e8e3f2] p-4 space-y-3"
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={testimonial.name}
                        onChange={(e) =>
                          updateMArrayItem(
                            "testimonials",
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Name"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={testimonial.role}
                        onChange={(e) =>
                          updateMArrayItem(
                            "testimonials",
                            index,
                            "role",
                            e.target.value,
                          )
                        }
                        placeholder="Role (e.g. Verified member)"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeMArrayItem("testimonials", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) =>
                        updateMArrayItem(
                          "testimonials",
                          index,
                          "quote",
                          e.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Quote"
                      className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                    <input
                      value={testimonial.highlight}
                      onChange={(e) =>
                        updateMArrayItem(
                          "testimonials",
                          index,
                          "highlight",
                          e.target.value,
                        )
                      }
                      placeholder="Highlight (bold callout)"
                      className="h-10 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addMArrayItem("testimonials", {
                      name: "",
                      role: "Verified member",
                      quote: "",
                      highlight: "",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" /> Add Testimonial
                </button>
              </div>
            </section>

            {/* ── Benefits Tab ─────────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Benefits Tab
              </h2>
              <div className="mt-4 space-y-4">
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Tab Description
                  </span>
                  <textarea
                    value={marketingForm.tabsDescription}
                    onChange={(e) =>
                      updateMField("tabsDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <div className="space-y-3">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Benefit Items
                  </span>
                  {marketingForm.tabsBenefits.map((benefit, index) => (
                    <div key={`tb-${index}`} className="flex gap-2">
                      <input
                        value={benefit.iconName}
                        onChange={(e) =>
                          updateMArrayItem(
                            "tabsBenefits",
                            index,
                            "iconName",
                            e.target.value,
                          )
                        }
                        placeholder="Lucide icon name (e.g. Zap)"
                        className="h-10 w-32 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={benefit.text}
                        onChange={(e) =>
                          updateMArrayItem(
                            "tabsBenefits",
                            index,
                            "text",
                            e.target.value,
                          )
                        }
                        placeholder="Benefit text"
                        className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeMArrayItem("tabsBenefits", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      addMArrayItem("tabsBenefits", {
                        iconName: "Sparkles",
                        text: "",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                  >
                    <AppIcon name="add" className="text-[16px]" /> Add Benefit
                  </button>
                </div>
              </div>
            </section>

            {/* ── Pricing Highlights ───────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Pricing Highlights
              </h2>
              <p className="mt-1 text-xs text-[#7f7892]">
                Short bullet points shown in the pricing section (e.g. "No
                hidden fees").
              </p>
              <div className="mt-4 space-y-3">
                {marketingForm.pricingHighlights.map((highlight, index) => (
                  <div key={`ph-${index}`} className="flex gap-2">
                    <input
                      value={highlight}
                      onChange={(e) => {
                        const next = [...marketingForm.pricingHighlights];
                        next[index] = e.target.value;
                        updateMField("pricingHighlights", next);
                      }}
                      className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeMArrayItem("pricingHighlights", index)
                      }
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addMArrayItem("pricingHighlights", "")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" /> Add Highlight
                </button>
              </div>
            </section>

            {/* ── Clean Ingredients ────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Clean Ingredients Badges
              </h2>
              <p className="mt-1 text-xs text-[#7f7892]">
                Icon badges shown at the bottom of the ingredients section. Use
                Lucide icon names (e.g. Leaf, Rabbit, FlaskConical).
              </p>
              <div className="mt-4 space-y-3">
                {marketingForm.cleanIngredients.map((ingredient, index) => (
                  <div key={`ci-${index}`} className="flex gap-2">
                    <input
                      value={ingredient.iconName}
                      onChange={(e) =>
                        updateMArrayItem(
                          "cleanIngredients",
                          index,
                          "iconName",
                          e.target.value,
                        )
                      }
                      placeholder="Icon (e.g. Leaf)"
                      className="h-10 w-36 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                    <input
                      value={ingredient.title}
                      onChange={(e) =>
                        updateMArrayItem(
                          "cleanIngredients",
                          index,
                          "title",
                          e.target.value,
                        )
                      }
                      placeholder="Label (e.g. Paraben Free)"
                      className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeMArrayItem("cleanIngredients", index)
                      }
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addMArrayItem("cleanIngredients", {
                      iconName: "Leaf",
                      title: "",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" /> Add Badge
                </button>
              </div>
            </section>

            {/* ── Simple Steps ─────────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Simple Steps
              </h2>
              <p className="mt-1 text-xs text-[#7f7892]">
                Step-by-step process shown on the product detail page.
              </p>
              <div className="mt-4 space-y-3">
                {marketingForm.simpleSteps.map((step, index) => (
                  <div
                    key={`ss-${index}`}
                    className="rounded-lg border border-[#e8e3f2] p-4 space-y-3"
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={step.title}
                        onChange={(e) =>
                          updateMArrayItem(
                            "simpleSteps",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Step title"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <input
                        value={step.step}
                        onChange={(e) =>
                          updateMArrayItem(
                            "simpleSteps",
                            index,
                            "step",
                            e.target.value,
                          )
                        }
                        placeholder="Step number / label"
                        className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeMArrayItem("simpleSteps", index)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        updateMArrayItem(
                          "simpleSteps",
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Step description"
                      className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                    <input
                      value={step.image}
                      onChange={(e) =>
                        updateMArrayItem(
                          "simpleSteps",
                          index,
                          "image",
                          e.target.value,
                        )
                      }
                      placeholder="Image URL"
                      className="h-10 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addMArrayItem("simpleSteps", {
                      title: "",
                      step: "",
                      description: "",
                      image: "",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                >
                  <AppIcon name="add" className="text-[16px]" /> Add Step
                </button>
              </div>
            </section>

            {/* ── Benefits Carousel Title ──────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Benefits Carousel Title
              </h2>
              <div className="mt-4">
                <input
                  value={marketingForm.benefitsCarouselTitle}
                  onChange={(e) =>
                    updateMField("benefitsCarouselTitle", e.target.value)
                  }
                  placeholder='e.g. "What are the benefits of NAD+?"'
                  className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                />
              </div>
            </section>

            {/* ── Feature Section ──────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Feature Section
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={marketingForm.featureSectionTitle}
                    onChange={(e) =>
                      updateMField("featureSectionTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Description paragraphs (one per line)
                  </span>
                  <textarea
                    value={marketingForm.featureSectionDescription}
                    onChange={(e) =>
                      updateMField("featureSectionDescription", e.target.value)
                    }
                    rows={5}
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Image URL
                  </span>
                  <input
                    value={marketingForm.featureSectionImage}
                    onChange={(e) =>
                      updateMField("featureSectionImage", e.target.value)
                    }
                    placeholder="/images/..."
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
              </div>
            </section>

            {/* ── Support Section ──────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Support Section
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={marketingForm.supportSectionTitle}
                    onChange={(e) =>
                      updateMField("supportSectionTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Subtitle
                  </span>
                  <input
                    value={marketingForm.supportSectionSubtitle}
                    onChange={(e) =>
                      updateMField("supportSectionSubtitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <div className="space-y-3">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Features
                  </span>
                  {marketingForm.supportSectionFeatures.map(
                    (feature, index) => (
                      <div
                        key={`sf-${index}`}
                        className="rounded-lg border border-[#e8e3f2] p-4 space-y-3"
                      >
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            value={feature.iconName}
                            onChange={(e) =>
                              updateMArrayItem(
                                "supportSectionFeatures",
                                index,
                                "iconName",
                                e.target.value,
                              )
                            }
                            placeholder="Lucide icon (e.g. Target)"
                            className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                          />
                          <input
                            value={feature.title}
                            onChange={(e) =>
                              updateMArrayItem(
                                "supportSectionFeatures",
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="Feature title"
                            className="h-10 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMArrayItem("supportSectionFeatures", index)
                            }
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          value={feature.description}
                          onChange={(e) =>
                            updateMArrayItem(
                              "supportSectionFeatures",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Short description"
                          className="h-10 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                        />
                      </div>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      addMArrayItem("supportSectionFeatures", {
                        iconName: "Sparkles",
                        title: "",
                        description: "",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                  >
                    <AppIcon name="add" className="text-[16px]" /> Add Feature
                  </button>
                </div>
              </div>
            </section>

            {/* ── Comprehensive Care ───────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Comprehensive Care Section
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={marketingForm.comprehensiveCareTitle}
                    onChange={(e) =>
                      updateMField("comprehensiveCareTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Description
                  </span>
                  <textarea
                    value={marketingForm.comprehensiveCareDescription}
                    onChange={(e) =>
                      updateMField(
                        "comprehensiveCareDescription",
                        e.target.value,
                      )
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    CTA Button Text
                  </span>
                  <input
                    value={marketingForm.comprehensiveCareCtaText}
                    onChange={(e) =>
                      updateMField("comprehensiveCareCtaText", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
              </div>
            </section>

            {/* ── Closing CTA ──────────────────────────────────────────── */}
            <section className="rounded-2xl border border-[#c9c4d8]/20 bg-white p-6">
              <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
                Closing CTA
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 block">
                    <span className="text-sm font-medium text-[#403d4c]">
                      Eyebrow
                    </span>
                    <input
                      value={marketingForm.closingCtaEyebrow}
                      onChange={(e) =>
                        updateMField("closingCtaEyebrow", e.target.value)
                      }
                      placeholder='e.g. "Ready to feel like you again?"'
                      className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </label>
                  <label className="space-y-1 block">
                    <span className="text-sm font-medium text-[#403d4c]">
                      Plan Label
                    </span>
                    <input
                      value={marketingForm.closingCtaPlanLabel}
                      onChange={(e) =>
                        updateMField("closingCtaPlanLabel", e.target.value)
                      }
                      placeholder="Product name shown in CTA"
                      className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                    />
                  </label>
                </div>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Title
                  </span>
                  <input
                    value={marketingForm.closingCtaTitle}
                    onChange={(e) =>
                      updateMField("closingCtaTitle", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Description
                  </span>
                  <textarea
                    value={marketingForm.closingCtaDescription}
                    onChange={(e) =>
                      updateMField("closingCtaDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
                <div className="space-y-3">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Bullet Points
                  </span>
                  {marketingForm.closingCtaBullets.map((bullet, index) => (
                    <div key={`cb-${index}`} className="flex gap-2">
                      <input
                        value={bullet}
                        onChange={(e) => {
                          const next = [...marketingForm.closingCtaBullets];
                          next[index] = e.target.value;
                          updateMField("closingCtaBullets", next);
                        }}
                        className="h-10 flex-1 rounded-lg border border-[#c9c4d8]/40 px-3 text-sm outline-none focus:border-[#5b3cdd]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeMArrayItem("closingCtaBullets", index)
                        }
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMArrayItem("closingCtaBullets", "")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm font-medium text-[#484555] hover:bg-[#f7f5fb]"
                  >
                    <AppIcon name="add" className="text-[16px]" /> Add Bullet
                  </button>
                </div>
                <label className="space-y-1 block">
                  <span className="text-sm font-medium text-[#403d4c]">
                    Support Note
                  </span>
                  <textarea
                    value={marketingForm.closingCtaSupportNote}
                    onChange={(e) =>
                      updateMField("closingCtaSupportNote", e.target.value)
                    }
                    rows={2}
                    placeholder="Fine-print note below the CTA"
                    className="w-full rounded-lg border border-[#c9c4d8]/40 px-3 py-2 text-sm outline-none focus:border-[#5b3cdd]"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#c9c4d8]/20 bg-white p-5">
            <h3 className="font-headline text-base font-bold text-[#1c1a24]">
              Publishing Notes
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#5b5768]">
              <li>Changes apply only to this product.</li>
              <li>
                The top sections (Overview, Before/After, Key Benefits, How It
                Works, Safety) control the admin detail UI.
              </li>
              <li>
                FAQs, Testimonials, Benefits Tab, Pricing Highlights, and all
                sections below it update the live storefront marketing page.
              </li>
              <li>
                Lucide icon names are case-sensitive (e.g.{" "}
                <code className="font-mono text-xs">Zap</code>,{" "}
                <code className="font-mono text-xs">Target</code>,{" "}
                <code className="font-mono text-xs">ShieldCheck</code>).
              </li>
              <li>Feature section description: one paragraph per line.</li>
              <li>Preview opens the live storefront product page.</li>
            </ul>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
