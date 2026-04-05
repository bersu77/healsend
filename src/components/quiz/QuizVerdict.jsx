import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { QUIZ_VERIFIED_AVATAR } from "@/lib/quiz-social-proof";

export default function QuizVerdict({ answers, onContinue }) {
  const score = answers.reduce((acc, a) => acc + a, 0);
  const isLow = score >= 2;
  const severityScore = Math.min(95, 45 + score * 15);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center px-5 py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0114 0%, #1A0B2E 50%, #0F051F 100%)" }}
    >
      {/* Animated glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
            x: [20, -20, 20],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-[150px]"
        />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-8 mb-16 flex-wrap"
        >
          {[
            { text: "FDA Registered Facility" },
            { text: "ISO 9001 Certified" },
            { text: "12,847+ Clinical Cases" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 backdrop-blur-xl shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
            >
              <span className="text-xs text-purple-200 font-bold">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-blue-500/30 blur-3xl rounded-3xl" />
          
          <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-slate-900/90 rounded-3xl border-2 border-purple-500/40 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-10 sm:p-16 border-b border-purple-500/20">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500/20 via-red-500/20 to-orange-500/20 border-2 border-rose-500/50 mb-8 shadow-lg shadow-rose-500/30"
                >
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/80" />
                  <span className="text-sm font-black tracking-widest uppercase text-rose-300">
                    ⚠️ Critical Deficiency Detected
                  </span>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl sm:text-7xl font-black text-white leading-tight mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                >
                  Your GHK-Cu Levels Are
                  <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]">
                    Severely Depleted
                  </span>
                </motion.h2>
                
                <p className="text-lg sm:text-xl text-purple-200 font-semibold max-w-2xl mx-auto leading-relaxed">
                  Clinical data shows you've lost <span className="text-rose-400 font-black">{severityScore}%</span> of your cellular repair capacity
                </p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/40 to-red-500/40 blur-2xl group-hover:blur-3xl transition-all rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-slate-800/90 via-rose-900/20 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-rose-500/50 shadow-2xl group-hover:border-rose-400/70 transition-all">
                    <div className="mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-rose-300">Peptide Loss</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-6xl font-black bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]">
                        {severityScore}
                      </span>
                      <span className="text-3xl font-black text-rose-500">%</span>
                    </div>
                    <p className="text-sm text-rose-200/80">Below optimal levels</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-violet-500/40 blur-2xl group-hover:blur-3xl transition-all rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-slate-800/90 via-purple-900/20 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl group-hover:border-purple-400/70 transition-all">
                    <div className="mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-300">Collagen Synthesis</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-6xl font-black bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                        {isLow ? "34" : "47"}
                      </span>
                      <span className="text-3xl font-black text-purple-500">%</span>
                    </div>
                    <p className="text-sm text-purple-200/80">Of peak production</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-blue-500/40 blur-2xl group-hover:blur-3xl transition-all rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-slate-800/90 via-indigo-900/20 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-indigo-500/50 shadow-2xl group-hover:border-indigo-400/70 transition-all">
                    <div className="mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Recovery Timeline</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                        12
                      </span>
                      <span className="text-xl font-black text-indigo-500">weeks</span>
                    </div>
                    <p className="text-sm text-indigo-200/80">To restore function</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Data section */}
            <div className="p-10 sm:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-xl rounded-xl" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 text-3xl">
                      📉
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      GHK-Cu Depletion Over Time
                    </h3>
                    <p className="text-sm text-purple-300 font-semibold">Measured concentration levels by age</p>
                  </div>
                </div>

                <div className="relative bg-slate-950/70 rounded-3xl p-10 border-2 border-purple-500/30 mb-8 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl" />
                  
                  <div className="relative h-80">
                    <svg viewBox="0 0 600 250" className="w-full h-full">
                      <defs>
                        <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
                          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="30%" stopColor="#8B5CF6" />
                          <stop offset="60%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {[50, 100, 150, 200].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="#1E293B" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
                      ))}
                      
                      <motion.path
                        d="M 0 30 Q 120 25 180 50 T 300 100 T 420 160 T 540 200 L 600 220 L 600 250 L 0 250 Z"
                        fill="url(#areaGlow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1.5 }}
                      />
                      
                      <motion.path
                        d="M 0 30 Q 120 25 180 50 T 300 100 T 420 160 T 540 200 L 600 220"
                        fill="none"
                        stroke="url(#lineGlow)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2, duration: 3, ease: "easeOut" }}
                      />
                      
                      <motion.circle
                        cx="0" cy="30" r="8" fill="#A855F7"
                        filter="url(#glow)"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                      />
                      
                      <motion.circle
                        cx="600" cy="220" r="10" fill="#EF4444"
                        filter="url(#glow)"
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [1, 0.6, 1]
                        }}
                        transition={{ delay: 4, duration: 2, repeat: Infinity }}
                      />
                      
                      <text x="10" y="20" fill="#A855F7" fontSize="15" fontWeight="900" filter="url(#glow)">
                        Peak Levels (Age 20)
                      </text>
                      <text x="440" y="190" fill="#EF4444" fontSize="17" fontWeight="900" filter="url(#glow)">
                        Current ↓{severityScore}%
                      </text>
                      
                      <text x="10" y="245" fill="#64748B" fontSize="12" fontWeight="600">Age 20</text>
                      <text x="520" y="245" fill="#64748B" fontSize="12" fontWeight="600">Now</text>
                    </svg>
                  </div>
                </div>

                {/* Scientific explanation */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-2xl rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-slate-800/80 via-purple-900/10 to-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/40 group-hover:border-purple-400/60 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="text-5xl drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">💉</div>
                      <div>
                        <h4 className="text-white font-black text-xl mb-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                          Why Topical Products Can't Fix This
                        </h4>
                        <p className="text-purple-200 text-base leading-relaxed mb-4">
                          Your GHK-Cu levels have dropped below the threshold needed for collagen synthesis. Serums and creams cannot penetrate deep enough to reach the cellular repair zone.
                        </p>
                        <p className="text-white text-base leading-relaxed font-semibold">
                          The Precision Vial™ delivers pharmaceutical-grade GHK-Cu directly to the dermis layer where regeneration occurs. This is the only delivery method with proven bioavailability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Protocol section */}
            <div className="p-10 sm:p-16 bg-gradient-to-br from-slate-950/90 via-purple-950/30 to-slate-950/90 border-t-2 border-purple-500/30">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl rounded-xl" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 text-3xl">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                      Clinical Protocol Overview
                    </h3>
                    <p className="text-sm text-emerald-400 font-bold">Pharmaceutical-Grade GHK-Cu Therapy</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  {[
                    { num: "01", title: "Micro-Dose Injection", desc: "Precision delivery to the dermal layer. 100% bioavailability vs 3-5% with topicals." },
                    { num: "02", title: "Cellular Uptake", desc: "GHK-Cu binds to copper receptors. Collagen synthesis begins within 48 hours." },
                    { num: "03", title: "Matrix Remodeling", desc: "Weeks 1-4: Elastin production increases. Weeks 4-8: Visible density improvement." },
                    { num: "04", title: "Sustained Results", desc: "Week 12: Full collagen matrix regeneration. Measurable firmness and thickness." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 blur-xl rounded-2xl group-hover:blur-2xl transition-all" />
                      <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 group-hover:border-purple-400/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-2 border-purple-500/40 shadow-lg shadow-purple-500/20 flex-shrink-0">
                            <span className="text-purple-400 font-black text-sm drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">{item.num}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-black text-lg mb-2 group-hover:text-purple-300 transition-colors drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                              {item.title}
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Verified result */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="relative group mb-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-2xl rounded-2xl" />
                  <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-500/40 group-hover:border-amber-400/60 transition-all">
                    <div className="flex items-start gap-5">
                      <img 
                        src={QUIZ_VERIFIED_AVATAR}
                        alt="Verified"
                        className="w-16 h-16 rounded-full border-3 border-amber-500/60 shadow-lg shadow-amber-500/30"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/30">✓ Verified Purchase</span>
                        </div>
                        <p className="text-white text-base leading-relaxed mb-3 font-medium">
                          "My dermatologist measured a 34% increase in dermal thickness after 12 weeks. The before/after scans don't lie. This is the first treatment that actually delivered measurable results."
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-black text-purple-300">Dr. Jennifer Martinez</span>
                          <span className="text-sm text-slate-600">•</span>
                          <span className="text-sm text-slate-400">Age 42, Austin TX</span>
                          <span className="text-sm text-slate-600">•</span>
                          <span className="text-sm text-emerald-400 font-bold">3-Month Protocol</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 }}
                  className="text-center"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 blur-3xl opacity-70" />
                    <motion.button
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: "0 0 80px rgba(168, 85, 247, 0.8)" 
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onContinue}
                      className="relative group inline-flex items-center gap-4 px-14 py-7 rounded-full font-black text-2xl shadow-2xl transition-all overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #A855F7, #8B5CF6, #6366F1)" }}
                    >
                      <span className="absolute inset-0 bg-white/20" />
                      <span className="relative text-white drop-shadow-lg">View Clinical Protocol</span>
                      <ArrowRight className="w-6 h-6 relative text-white transition-transform group-hover:translate-x-2 drop-shadow-lg" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
                    <span className="text-sm text-slate-300 font-semibold">🛡️ 30-Day Clinical Guarantee</span>
                    <span className="text-sm text-slate-300 font-semibold">⏱️ Ships Within 48 Hours</span>
                    <span className="text-sm text-slate-300 font-semibold">👥 847 Active Patients</span>
                  </div>

                  <p className="text-sm text-purple-300/80 mt-6 font-medium">
                    Protocol customized based on your depletion severity
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="flex items-center justify-center gap-12 flex-wrap"
        >
          {[
            { value: "12,847", label: "Clinical Cases" },
            { value: "4.9/5.0", label: "Patient Rating" },
            { value: "89%", label: "Measurable Results" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400 font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
