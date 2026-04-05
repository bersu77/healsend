import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { QUIZ_INTRO_AVATARS } from "@/lib/quiz-social-proof";

export default function QuizIntro({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
      style={{ background: "linear-gradient(180deg, #0A0114 0%, #1A0B2E 50%, #0F051F 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-center max-w-lg"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/40 shadow-md shadow-purple-500/30 mb-8 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-400/50" />
          <span className="text-xs font-bold tracking-widest uppercase text-purple-300">
            GHK-Cu Assessment
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          Measure Your
          <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]">
            Cellular Depletion
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-purple-200 leading-relaxed mb-10 max-w-md mx-auto font-semibold">
          Clinical screening to determine your GHK-Cu peptide deficiency level — <span className="font-black text-purple-400">takes 30 seconds</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(168, 85, 247, 0.6)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-black text-lg shadow-2xl transition-all"
          style={{ background: "linear-gradient(135deg, #A855F7, #8B5CF6, #6366F1)" }}
        >
          Begin Assessment
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
        </motion.button>

        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-purple-300 font-semibold">
          <span>⏱️ 30 seconds</span>
          <div className="w-px h-3 bg-purple-500/30" />
          <span>🛡️ 100% Private</span>
          <div className="w-px h-3 bg-purple-500/30" />
          <span>🔬 Clinical-Grade</span>
        </div>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center justify-center -space-x-2 mb-3">
          {QUIZ_INTRO_AVATARS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <p className="text-xs text-purple-300">
          <span className="font-bold text-purple-400">12,847+</span> clinical assessments completed
        </p>
      </motion.div>
    </motion.div>
  );
}
