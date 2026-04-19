"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import AppIcon from "@/components/ui/AppIcon";
import {
  normalizeHomepageHeadlinePhrases,
  normalizeHomepageManagedImage,
} from "@/lib/homepage-assets";
import { useNotifications } from "@/lib/NotificationContext";

const DEFAULT_HOME_EDITOR_STATE = Object.freeze({
  title: "HealSend",
  seoTitle: "",
  seoDescription:
    "Clinician-guided treatment, onboarding, and ongoing care through HealSend.",
  heroImage: "",
  content: {
    hero: {
      headlinePhrases: [
        { text: "Weight Loss", color: "#7B75F0" },
        { text: "More Energy", color: "#7B68EE" },
        { text: "Sharper Mind", color: "#2F5EFF" },
        { text: "Heal & Recover", color: "#12B379" },
        { text: "Stronger Body", color: "#485867" },
        { text: "Better Sex", color: "#8B2020" },
        { text: "100% Online", color: "#1D1D1F" },
      ],
      titleLineOne: "Weight loss",
      titleLineTwo: "tailored to you",
      description: "Look, feel and perform your best every day.",
      trustPoints: [
        { label: "Licensed providers in your state" },
        { label: "Free discreet shipping" },
        { label: "FSA & HSA eligible with all plans" },
      ],
      row1: [
        {
          title: "Personalized\nGLP-1 Treatments",
          subtitle: "for weight loss",
          image: "/images/marketing/glp1-hero-merged-tight.png",
          href: "/weight-loss",
        },
        {
          title: "Oxytocin\nNasal Spray",
          subtitle: "for intimacy support",
          image: "/images/marketing/bundle/oxytocin-nasal-spray-product.png",
          href: "/oxytocin-nasal-spray",
        },
        {
          title: "NAD+\nInjections",
          subtitle: "for energy and longevity",
          image: "/images/marketing/bundle/nad-injections-product.png",
          href: "/nad",
        },
      ],
      row2: [
        {
          title: "MIC+B12",
          subtitle: "for mood and energy",
          image: "/images/marketing/bundle/mic-b12-product.png",
          href: "/mic-injection",
        },
        {
          title: "Hormone Therapy",
          subtitle: "for women",
          image: "/images/marketing/bundle/enclomiphene-product.png",
          href: "/strength-recovery",
        },
        {
          title: "Glutathione",
          subtitle: "for antioxidant support",
          image: "/images/marketing/bundle/glutathione-injection-product.png",
          href: "/glutathione-ldn",
        },
        {
          title: "Skin Care",
          subtitle: "with NAD+",
          image: "/images/marketing/nad-patches.png",
          href: "/anti-aging",
        },
      ],
    },
    splitFeatures: {
      cards: [
        {
          title: "No one-size-fits-all",
          description:
            "A provider licensed in your state will review your information, so that they can combine guidance on nutrition, activity, sleep, and more into a plan designed around your body's needs.",
          ctaText: "Get started",
          ctaHref: "/weight-loss",
          image: "/images/home/reference/split-feature-product.jpg",
          imageAlt: "HealSend treatment options",
          accentText: "it's personal",
        },
        {
          title: "Moving in the\nright direction",
          description:
            "Get a personalized weight loss plan designed with one goal in mind: helping you feel happy in your body.",
          ctaText: "See if I'm eligible",
          ctaHref: "/weight-loss",
          image: "/images/home/reference/Photoroom-1.png",
        },
      ],
    },
  },
});

function mergeCardList(defaults, source) {
  return defaults.map((item, index) => ({
    ...item,
    ...(Array.isArray(source) ? source[index] || {} : {}),
  }));
}

function mergeHeadlinePhraseList(defaults, source) {
  return normalizeHomepageHeadlinePhrases(source, defaults);
}

function normalizeHomeEditorState(payload) {
  const content =
    payload?.content && typeof payload.content === "object"
      ? payload.content
      : {};
  const hero =
    content.hero && typeof content.hero === "object" ? content.hero : {};
  const defaultHeroRow1 = DEFAULT_HOME_EDITOR_STATE.content.hero.row1;
  const defaultHeroRow2 = DEFAULT_HOME_EDITOR_STATE.content.hero.row2;
  const defaultHeroCards = [...defaultHeroRow1, ...defaultHeroRow2];
  const sourceHeroCards = [
    ...(Array.isArray(hero.row1) ? hero.row1 : []),
    ...(Array.isArray(hero.row2) ? hero.row2 : []),
  ];
  const mergedHeroCards = defaultHeroCards.map((item, index) => ({
    ...item,
    ...(sourceHeroCards[index] || {}),
    image: normalizeHomepageManagedImage(
      sourceHeroCards[index]?.image,
      item.image,
    ),
  }));
  const heroHeadlinePhrases =
    Array.isArray(hero.headlinePhrases) && hero.headlinePhrases.length > 0
      ? hero.headlinePhrases
      : Array.isArray(hero.phrases) && hero.phrases.length > 0
        ? hero.phrases
        : undefined;
  const splitFeatures =
    content.splitFeatures && typeof content.splitFeatures === "object"
      ? content.splitFeatures
      : {};

  return {
    title: payload?.title || DEFAULT_HOME_EDITOR_STATE.title,
    seoTitle: payload?.seoTitle || DEFAULT_HOME_EDITOR_STATE.seoTitle,
    seoDescription:
      payload?.seoDescription || DEFAULT_HOME_EDITOR_STATE.seoDescription,
    heroImage: payload?.heroImage || DEFAULT_HOME_EDITOR_STATE.heroImage,
    content: {
      ...content,
      hero: {
        ...DEFAULT_HOME_EDITOR_STATE.content.hero,
        ...hero,
        headlinePhrases: mergeHeadlinePhraseList(
          DEFAULT_HOME_EDITOR_STATE.content.hero.headlinePhrases,
          heroHeadlinePhrases,
        ),
        titleLineOne: DEFAULT_HOME_EDITOR_STATE.content.hero.titleLineOne,
        titleLineTwo:
          hero.titleLineTwo ||
          hero.subtitle ||
          DEFAULT_HOME_EDITOR_STATE.content.hero.titleLineTwo,
        trustPoints: mergeCardList(
          DEFAULT_HOME_EDITOR_STATE.content.hero.trustPoints,
          hero.trustPoints,
        ),
        row1: mergedHeroCards.slice(0, defaultHeroRow1.length),
        row2: mergedHeroCards.slice(
          defaultHeroRow1.length,
          defaultHeroRow1.length + defaultHeroRow2.length,
        ),
      },
      splitFeatures: {
        ...DEFAULT_HOME_EDITOR_STATE.content.splitFeatures,
        ...splitFeatures,
        cards: mergeCardList(
          DEFAULT_HOME_EDITOR_STATE.content.splitFeatures.cards,
          splitFeatures.cards,
        ).map((card, index) => ({
          ...card,
          image: normalizeHomepageManagedImage(
            card.image,
            DEFAULT_HOME_EDITOR_STATE.content.splitFeatures.cards[index]?.image,
          ),
        })),
      },
    },
  };
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-[#c9c4d8]/20 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="font-headline text-lg font-bold text-[#1c1a24]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-[#484555]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function HomepageAdminPage() {
  const { notify } = useNotifications();
  const [form, setForm] = useState(DEFAULT_HOME_EDITOR_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing-pages/home");
      const data = await res.json();
      setForm(normalizeHomeEditorState(data));
    } catch {
      notify.error("Error", "Failed to load homepage settings.");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const inputCls =
    "w-full rounded-lg border border-[#c9c4d8]/30 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#5b3cdd]";
  const textAreaCls = `${inputCls} min-h-[96px] resize-y`;

  const hero = form.content.hero;
  const splitFeatures = form.content.splitFeatures;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateContent = (sectionKey, value) => {
    setForm((current) => ({
      ...current,
      content: {
        ...current.content,
        [sectionKey]: value,
      },
    }));
  };

  const updateHeroField = (key, value) => {
    updateContent("hero", {
      ...hero,
      [key]: value,
    });
  };

  const updateHeadlinePhrase = (index, key, value) => {
    const nextPhrases = hero.headlinePhrases.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    updateHeroField("headlinePhrases", nextPhrases);
  };

  const moveHeadlinePhrase = (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= hero.headlinePhrases.length) {
      return;
    }

    const nextPhrases = [...hero.headlinePhrases];
    const [moved] = nextPhrases.splice(index, 1);
    nextPhrases.splice(targetIndex, 0, moved);
    updateHeroField("headlinePhrases", nextPhrases);
  };

  const addHeadlinePhrase = () => {
    const defaultPhrasePalette =
      DEFAULT_HOME_EDITOR_STATE.content.hero.headlinePhrases;
    const nextDefault =
      defaultPhrasePalette[
        hero.headlinePhrases.length % defaultPhrasePalette.length
      ] || defaultPhrasePalette[0];

    updateHeroField("headlinePhrases", [
      ...hero.headlinePhrases,
      {
        text: "New phrase",
        color: nextDefault?.color || "#1D1D1F",
      },
    ]);
  };

  const removeHeadlinePhrase = (index) => {
    if (hero.headlinePhrases.length <= 1) {
      return;
    }

    updateHeroField(
      "headlinePhrases",
      hero.headlinePhrases.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateHeroTrustPoint = (index, value) => {
    const nextTrustPoints = hero.trustPoints.map((item, itemIndex) =>
      itemIndex === index ? { ...item, label: value } : item,
    );
    updateHeroField("trustPoints", nextTrustPoints);
  };

  const updateHeroCard = (rowKey, index, key, value) => {
    const nextItems = hero[rowKey].map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    updateHeroField(rowKey, nextItems);
  };

  const updateSplitCard = (index, key, value) => {
    const nextCards = splitFeatures.cards.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    updateContent("splitFeatures", {
      ...splitFeatures,
      cards: nextCards,
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        content: {
          ...form.content,
          hero: {
            ...hero,
            titleLineOne: DEFAULT_HOME_EDITOR_STATE.content.hero.titleLineOne,
            headlinePhrases: normalizeHomepageHeadlinePhrases(
              hero.headlinePhrases,
              DEFAULT_HOME_EDITOR_STATE.content.hero.headlinePhrases,
            ),
            row1: hero.row1.map((card, index) => ({
              ...card,
              image: normalizeHomepageManagedImage(
                card.image,
                DEFAULT_HOME_EDITOR_STATE.content.hero.row1[index]?.image,
              ),
            })),
            row2: hero.row2.map((card, index) => ({
              ...card,
              image: normalizeHomepageManagedImage(
                card.image,
                DEFAULT_HOME_EDITOR_STATE.content.hero.row2[index]?.image,
              ),
            })),
          },
          splitFeatures: {
            ...splitFeatures,
            cards: splitFeatures.cards.map((card, index) => ({
              ...card,
              image: normalizeHomepageManagedImage(
                card.image,
                DEFAULT_HOME_EDITOR_STATE.content.splitFeatures.cards[index]
                  ?.image,
              ),
            })),
          },
        },
      };
      const res = await fetch("/api/marketing-pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("save_failed");
      }

      const data = await res.json();
      setForm(normalizeHomeEditorState(data));
      notify.success("Homepage Saved", "Homepage content has been updated.");
    } catch {
      notify.error("Error", "Failed to save homepage content.");
    } finally {
      setSaving(false);
    }
  };

  const rowCards = useMemo(
    () => [
      {
        key: "row1",
        title: "Featured Cards",
        description: "Large top-row cards in the homepage hero.",
      },
      {
        key: "row2",
        title: "Secondary Cards",
        description: "Smaller lower-row cards in the homepage hero.",
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5b3cdd] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
            Homepage
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-[#484555]">
            Edit homepage assets and copy through structured fields. The layout
            stays fixed in code, so the client can safely update content without
            a WordPress-style page builder.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="hs-gradient-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
        >
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <AppIcon name="save" className="h-[18px] w-[18px]" />
          )}
          Save Homepage
        </button>
      </div>

      <SectionCard
        title="SEO and Meta"
        description="These fields affect homepage metadata and social-preview assets."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
              Page Title
            </label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
              SEO Title
            </label>
            <input
              className={inputCls}
              value={form.seoTitle}
              onChange={(event) => updateForm("seoTitle", event.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
            SEO Description
          </label>
          <textarea
            className={textAreaCls}
            value={form.seoDescription}
            onChange={(event) =>
              updateForm("seoDescription", event.target.value)
            }
          />
        </div>
        <div className="mt-4">
          <ImageUpload
            label="Meta / Preview Image"
            hint="Recommended: 1200×630px (Open Graph / social preview)"
            value={form.heroImage}
            onChange={(url) => updateForm("heroImage", url)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Hero Intro"
        description="Top headline, supporting copy, trust points, and the homepage card grid."
      >
        <div className="rounded-xl border border-[#c9c4d8]/20 bg-[#faf9fe] p-4">
          <p className="text-sm text-[#484555]">
            The animated first headline line is controlled entirely by the
            phrase list below. The only static hero line here is the second
            line.
          </p>
        </div>

        <div className="mt-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
              Static Second Line
            </label>
            <input
              className={inputCls}
              value={hero.titleLineTwo}
              onChange={(event) =>
                updateHeroField("titleLineTwo", event.target.value)
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
            Hero Description
          </label>
          <textarea
            className={textAreaCls}
            value={hero.description}
            onChange={(event) =>
              updateHeroField("description", event.target.value)
            }
          />
        </div>

        <div className="mt-6">
          <div className="mb-3">
            <h4 className="font-headline text-base font-bold text-[#1c1a24]">
              Animated Headline Phrases
            </h4>
            <p className="text-sm text-[#484555]">
              Control the sentence order, wording, and accent color used in the
              animated first headline line.
            </p>
          </div>

          <div className="space-y-3">
            {hero.headlinePhrases.map((phrase, index) => (
              <div
                key={`headline-phrase-${index}`}
                className="rounded-xl border border-[#c9c4d8]/20 bg-[#faf9fe] p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px_260px]">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                      Phrase {index + 1}
                    </label>
                    <input
                      className={inputCls}
                      value={phrase.text || ""}
                      onChange={(event) =>
                        updateHeadlinePhrase(index, "text", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-11 w-14 cursor-pointer rounded-lg border border-[#c9c4d8]/30 bg-white p-1"
                        value={phrase.color || "#000000"}
                        onChange={(event) =>
                          updateHeadlinePhrase(
                            index,
                            "color",
                            event.target.value,
                          )
                        }
                      />
                      <input
                        className={inputCls}
                        value={phrase.color || ""}
                        onChange={(event) =>
                          updateHeadlinePhrase(
                            index,
                            "color",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                      Actions
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => moveHeadlinePhrase(index, -1)}
                        disabled={index === 0}
                        className="inline-flex items-center justify-center rounded-lg border border-[#c9c4d8]/30 bg-white px-3 py-2.5 text-sm font-medium text-[#1c1a24] disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHeadlinePhrase(index, 1)}
                        disabled={index === hero.headlinePhrases.length - 1}
                        className="inline-flex items-center justify-center rounded-lg border border-[#c9c4d8]/30 bg-white px-3 py-2.5 text-sm font-medium text-[#1c1a24] disabled:opacity-40"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removeHeadlinePhrase(index)}
                        disabled={hero.headlinePhrases.length <= 1}
                        className="inline-flex items-center justify-center rounded-lg border border-[#f1c7cf] bg-white px-3 py-2.5 text-sm font-medium text-[#a23449] disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={addHeadlinePhrase}
              className="inline-flex items-center justify-center rounded-lg border border-[#c9c4d8]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#1c1a24]"
            >
              Add phrase
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-headline text-base font-bold text-[#1c1a24]">
            Trust Points
          </h4>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {hero.trustPoints.map((point, index) => (
              <div key={`trust-point-${index}`}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                  Trust Point {index + 1}
                </label>
                <input
                  className={inputCls}
                  value={point.label}
                  onChange={(event) =>
                    updateHeroTrustPoint(index, event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {rowCards.map((row) => (
          <div key={row.key} className="mt-8">
            <div className="mb-3">
              <h4 className="font-headline text-base font-bold text-[#1c1a24]">
                {row.title}
              </h4>
              <p className="text-sm text-[#484555]">{row.description}</p>
            </div>
            <div className="space-y-4">
              {hero[row.key].map((card, index) => (
                <div
                  key={`${row.key}-${index}`}
                  className="rounded-xl border border-[#c9c4d8]/20 bg-[#faf9fe] p-4"
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1c1a24]">
                    <AppIcon
                      name="crop_portrait"
                      className="h-[18px] w-[18px]"
                    />
                    Card {index + 1}
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                            Title
                          </label>
                          <textarea
                            className={textAreaCls}
                            value={card.title}
                            onChange={(event) =>
                              updateHeroCard(
                                row.key,
                                index,
                                "title",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                            Subtitle
                          </label>
                          <textarea
                            className={textAreaCls}
                            value={card.subtitle}
                            onChange={(event) =>
                              updateHeroCard(
                                row.key,
                                index,
                                "subtitle",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                          Link
                        </label>
                        <input
                          className={inputCls}
                          value={card.href}
                          onChange={(event) =>
                            updateHeroCard(
                              row.key,
                              index,
                              "href",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <ImageUpload
                        label="Card Image"
                        hint={
                          row.key === "row1"
                            ? "Recommended: 800×900px (portrait product shot)"
                            : "Recommended: 500×500px (square product thumbnail)"
                        }
                        value={card.image}
                        onChange={(url) =>
                          updateHeroCard(row.key, index, "image", url)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Split Features"
        description="Structured editor for the two large split-feature cards under the banners."
      >
        <div className="space-y-5">
          {splitFeatures.cards.map((card, index) => (
            <div
              key={`split-card-${index}`}
              className="rounded-xl border border-[#c9c4d8]/20 bg-[#faf9fe] p-4"
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1c1a24]">
                <AppIcon name="view_day" className="h-[18px] w-[18px]" />
                {index === 0 ? "Left Card" : "Right Card"}
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                      Title
                    </label>
                    <textarea
                      className={textAreaCls}
                      value={card.title}
                      onChange={(event) =>
                        updateSplitCard(index, "title", event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                      Description
                    </label>
                    <textarea
                      className={textAreaCls}
                      value={card.description}
                      onChange={(event) =>
                        updateSplitCard(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                        CTA Text
                      </label>
                      <input
                        className={inputCls}
                        value={card.ctaText || ""}
                        onChange={(event) =>
                          updateSplitCard(index, "ctaText", event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                        CTA Link
                      </label>
                      <input
                        className={inputCls}
                        value={card.ctaHref || ""}
                        onChange={(event) =>
                          updateSplitCard(index, "ctaHref", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                        Accent Text
                      </label>
                      <input
                        className={inputCls}
                        value={card.accentText || ""}
                        onChange={(event) =>
                          updateSplitCard(
                            index,
                            "accentText",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#484555]">
                        Image Alt
                      </label>
                      <input
                        className={inputCls}
                        value={card.imageAlt || ""}
                        onChange={(event) =>
                          updateSplitCard(index, "imageAlt", event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <ImageUpload
                    label="Feature Image"
                    hint={
                      index === 0
                        ? "Recommended: 880×1000px (portrait product image)"
                        : "Recommended: 1200×800px (landscape background fill)"
                    }
                    value={card.image}
                    onChange={(url) => updateSplitCard(index, "image", url)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
