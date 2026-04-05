import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

export default function QuizQuestion({ question, questionIndex, totalQuestions, onAnswer }) {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (optionIndex) => {
    setSelected(optionIndex);
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelected(null);
    }, 500);
  };

  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
      style={{ background: "linear-gradient(180deg, #0A0114 0%, #1A0B2E 50%, #0F051F 100%)" }}
    >
      <div className="w-full max-w-lg">
        <ProgressBar current={questionIndex + 1} total={totalQuestions} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="text-6xl mb-6 drop-shadow-lg">{question.emoji}</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            {question.title}
          </h2>
          <p className="text-base text-purple-200 font-semibold max-w-sm mx-auto">
            {question.subtitle}
          </p>
        </motion.div>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl ${
                selected === i
                  ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-2xl shadow-purple-500/40 scale-[1.02]"
                  : "border-purple-500/30 bg-slate-800/60 hover:border-purple-400/50 hover:shadow-xl hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 shadow-md ${
                    selected === i
                      ? "border-purple-500 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-400/50"
                      : "border-purple-500/40 bg-slate-700"
                  }`}
                >
                  {selected === i && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-white shadow-inner"
                    />
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-snug">
                    {option.label}
                  </p>
                  <p className="text-sm text-purple-300 mt-1.5 font-medium">{option.sublabel}</p>
                </div>
                <span className="ml-auto text-2xl flex-shrink-0 drop-shadow-sm">{option.icon}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
