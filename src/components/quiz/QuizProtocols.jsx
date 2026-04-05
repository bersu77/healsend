import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowRight, Star } from "lucide-react";
import BenefitsStack from "./BenefitsStack";
import { QUIZ_REVIEW_AVATARS } from "@/lib/quiz-social-proof";

const protocols = [
  {
    id: "starter",
    name: "The Starter",
    duration: "1 Month",
    price: "$199",
    priceDetail: "one-time",
    outcome: "The Reset",
    outcomeDesc: "Systemic awakening of your cellular repair signals.",
    popular: false,
  },
  {
    id: "radiance",
    name: "The Radiance",
    duration: "3 Months",
    price: "$149",
    priceDetail: "/month",
    outcome: "The Transformation",
    outcomeDesc: "Full collagen remodeling cycle. Maximum visible results.",
    popular: true,
  },
  {
    id: "timeless",
    name: "The Timeless",
    duration: "12 Months",
    price: "$99",
    priceDetail: "/month",
    outcome: "Regenerative Mastery",
    outcomeDesc: "Maximum density protocol for skin and hair longevity.",
    popular: false,
  },
];

export default function QuizProtocols() {
  const [selectedPlan, setSelectedPlan] = useState("radiance");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleCheckout = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
        style={{ background: "linear-gradient(180deg, #FFF9F0 0%, #FFE4B8 50%, #FFF5E1 100%)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C8A96E, #E8D5A8)" }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-light text-stone-900 mb-3">
            Protocol <span className="font-semibold" style={{ color: "#C8A96E" }}>Activated</span>
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed font-light mb-8">
            Thank you for beginning your regenerative journey. A clinical specialist will reach out within 24 hours to finalize your personalized protocol.
          </p>
          <div className="bg-white rounded-2xl border border-stone-100 p-5 text-left">
            <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">What's Next</p>
            {[
              "Clinical intake form sent to your email",
              "1-on-1 consultation with your specialist",
              "Your precision vial ships within 48 hours",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#C8A96E" }}>
                  {i + 1}
                </div>
                <span className="text-sm text-stone-600">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center px-5 py-12"
      style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EC 50%, #FFF 100%)" }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight mb-4 tracking-tight">
            Select Your
            <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
              Protocol
            </span>
          </h2>
          <p className="text-base text-stone-600 font-semibold">
            All plans include the Precision Vial™ — Direct Micro-Dose System
          </p>
        </motion.div>

        {/* Protocol cards */}
        <div className="space-y-3 mb-8">
          {protocols.map((plan, i) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => handleSelect(plan.id)}
              className={`w-full text-left p-6 rounded-2xl border-3 transition-all duration-300 relative overflow-hidden ${
                selectedPlan === plan.id
                  ? plan.popular
                    ? "border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 shadow-2xl shadow-amber-300/50 scale-[1.02]"
                    : "border-amber-400 bg-amber-50 shadow-xl shadow-amber-200/40 scale-[1.01]"
                  : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-sm font-bold text-white shadow-lg animate-pulse" style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current drop-shadow-sm" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-all duration-300 ${
                    selectedPlan === plan.id ? "border-amber-400 bg-amber-400" : "border-stone-200"
                  }`}>
                    {selectedPlan === plan.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-stone-900 text-base">{plan.name}</span>
                      <span className="text-xs text-stone-400 font-medium">{plan.duration}</span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#C8A96E" }}>
                      {plan.outcome}
                    </p>
                    <p className="text-xs text-stone-400 font-light">{plan.outcomeDesc}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className="text-2xl font-bold text-stone-900">{plan.price}</span>
                  <span className="text-xs text-stone-400 block">{plan.priceDetail}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(217, 119, 6, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCheckout}
            className="w-full group flex items-center justify-center gap-3 px-10 py-6 rounded-full text-white font-bold text-xl shadow-2xl transition-all"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)" }}
          >
            Activate My Protocol
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-400">
              30-Day Potency Promise — full refund if no visible improvement
            </span>
          </div>
        </motion.div>

        {/* Benefits */}
        <BenefitsStack />

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-8 bg-white rounded-2xl border border-stone-100 p-6"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-5 text-center">
            Your Success Timeline
          </p>
          <div className="space-y-5">
            {[
              { week: "Week 1", title: "The Awakening", desc: "Cellular repair signaling begins. Subtle glow and improved skin texture.", color: "#E8D5A8" },
              { week: "Week 4", title: "The Visible Shift", desc: "Noticeable firmness. Reduced puffiness. Friends start asking what you changed.", color: "#C8A96E" },
              { week: "Week 12", title: "The Transformation", desc: "Full collagen remodeling. Measurably denser skin. Thicker, stronger hair.", color: "#B8964E" },
            ].map((milestone, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ background: milestone.color }} />
                  {i < 2 && <div className="w-px h-10 bg-stone-100" />}
                </div>
                <div className="-mt-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-stone-400">{milestone.week}</span>
                    <span className="text-xs text-stone-300">·</span>
                    <span className="text-sm font-semibold text-stone-800">{milestone.title}</span>
                  </div>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final trust */}
        <div className="text-center mt-10 pb-8">
          <div className="flex items-center justify-center -space-x-2 mb-3">
            {QUIZ_REVIEW_AVATARS.map((src, i) => (
              <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <div className="flex items-center justify-center gap-0.5 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-stone-400 font-light italic max-w-xs mx-auto">
            "My skin hasn't looked this good in a decade. The difference was visible by week 3."
          </p>
          <p className="text-xs text-stone-300 mt-1">— Sarah M., Verified Member</p>
        </div>
      </div>
    </motion.div>
  );
}
