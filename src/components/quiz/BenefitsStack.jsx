import React from "react";
import { motion } from "framer-motion";
import { Dna, Shield, Moon, Heart } from "lucide-react";

const benefits = [
  {
    icon: Dna,
    title: "Structural Remodeling",
    desc: "Watch your skin regain the density of your 20s through collagen synthesis activation.",
  },
  {
    icon: Heart,
    title: "Follicle Anchoring",
    desc: "Dramatic increase in lash length and hair \"staying power\" from the root.",
  },
  {
    icon: Moon,
    title: "Cellular Restoration",
    desc: "High-purity GHK-Cu is linked to deeper, more restorative sleep cycles.",
  },
  {
    icon: Shield,
    title: "Inflammation Control",
    desc: "Systemic reduction in morning puffiness and persistent redness.",
  },
];

const replacements = [
  { label: "Monthly Botox Tweakments", cost: "$600+" },
  { label: "High-end Night Creams", cost: "$200+" },
  { label: "Professional Lash Extensions", cost: "$150/mo" },
  { label: "Thinning Hair Treatments", cost: "$100/mo" },
];

export default function BenefitsStack() {
  return (
    <div className="space-y-8">
      {/* Benefits grid */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-5 text-center">
          The Cumulative Benefits
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl border-2 border-amber-200 p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md" style={{ background: "linear-gradient(135deg, #FCD34D, #F59E0B)" }}>
                <b.icon className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <p className="font-bold text-stone-900 text-base mb-2">{b.title}</p>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Value comparison */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="bg-white rounded-2xl border border-stone-100 p-6"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-4">
          One 3-Month Protocol Replaces
        </p>
        <div className="space-y-3">
          {replacements.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">✕</span>
                </div>
                <span className="text-sm text-stone-500">{r.label}</span>
              </div>
              <span className="text-sm font-medium text-stone-300 line-through">{r.cost}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-sm font-medium text-stone-700">Total Saved Per Quarter</span>
          <span className="text-lg font-bold" style={{ color: "#C8A96E" }}>$1,050+</span>
        </div>
      </motion.div>
    </div>
  );
}