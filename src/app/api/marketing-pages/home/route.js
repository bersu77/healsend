import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { normalizeHomepageHeadlinePhrases } from "@/lib/homepage-assets";
import { NextResponse } from "next/server";

function sanitizeText(value) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 ? normalized : null;
}

function sanitizeContent(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sanitizeHeadlinePhrases(value) {
  return normalizeHomepageHeadlinePhrases(value).map((phrase) => ({
    text: sanitizeText(phrase.text),
    color: sanitizeText(phrase.color),
  }));
}

function sanitizeHomepageContent(value) {
  const content = sanitizeContent(value);
  const hero = sanitizeContent(content.hero);

  return {
    ...content,
    hero: {
      ...hero,
      headlinePhrases: sanitizeHeadlinePhrases(
        hero.headlinePhrases || hero.phrases,
      ),
      titleLineOne: sanitizeText(hero.titleLineOne),
      titleLineTwo: sanitizeText(hero.titleLineTwo || hero.subtitle),
      description: sanitizeText(hero.description),
      trustPoints: Array.isArray(hero.trustPoints)
        ? hero.trustPoints.map((point) => ({
            ...point,
            label: sanitizeText(point?.label),
          }))
        : [],
      row1: Array.isArray(hero.row1) ? hero.row1 : [],
      row2: Array.isArray(hero.row2) ? hero.row2 : [],
    },
  };
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const page = await prisma.marketingPage.findUnique({
    where: { slug: "home" },
    select: {
      id: true,
      slug: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      heroImage: true,
      content: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(
    page
      ? {
          ...page,
          content: sanitizeHomepageContent(page.content),
        }
      : {
          slug: "home",
          title: "HealSend",
          seoTitle: null,
          seoDescription: null,
          heroImage: null,
          content: {},
          updatedAt: null,
        },
  );
}

export async function PUT(request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const body = await request.json();
  const title = sanitizeText(body.title) || "HealSend";
  const seoTitle = sanitizeText(body.seoTitle);
  const seoDescription = sanitizeText(body.seoDescription);
  const heroImage = sanitizeText(body.heroImage);
  const content = sanitizeHomepageContent(body.content);

  const page = await prisma.marketingPage.upsert({
    where: { slug: "home" },
    update: {
      title,
      pageType: "HOME",
      source: "custom",
      seoTitle,
      seoDescription,
      heroImage,
      content,
    },
    create: {
      slug: "home",
      title,
      pageType: "HOME",
      source: "custom",
      seoTitle,
      seoDescription,
      heroImage,
      content,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      heroImage: true,
      content: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    ...page,
    content: sanitizeHomepageContent(page.content),
  });
}
