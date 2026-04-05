import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { id: "intro", label: "Intro" },
  { id: "question", label: "Assessment" },
  { id: "verdict", label: "Verdict" },
  { id: "protocols", label: "Protocols" },
];

function getStepIndex(stepId) {
  return Math.max(
    0,
    STEPS.findIndex((s) => s.id === stepId),
  );
}

export default function QuizStepper({ step, questionProgress }) {
  const activeIndex = getStepIndex(step);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,620px)] pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl"
      >
        <div className="grid grid-cols-4 gap-2 p-2">
          {STEPS.map((s, i) => {
            const isActive = i === activeIndex;
            const isComplete = i < activeIndex;
            const isQuestionStep = s.id === "question";

            const subtitle =
              isQuestionStep && step === "question" && questionProgress?.total
                ? `${questionProgress.current}/${questionProgress.total}`
                : null;

            return (
              <div
                key={s.id}
                className={[
                  "rounded-xl px-3 py-2.5 border transition-colors",
                  isActive
                    ? "border-purple-400/40 bg-gradient-to-br from-purple-500/20 to-indigo-500/10"
                    : "border-white/10 bg-white/5",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={[
                        "w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0",
                        isComplete
                          ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-200"
                          : isActive
                            ? "border-purple-400/40 bg-purple-400/10 text-purple-200"
                            : "border-white/15 bg-white/5 text-white/50",
                      ].join(" ")}
                    >
                      {isComplete ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={[
                          "text-xs font-semibold tracking-wide truncate",
                          isActive ? "text-white" : "text-white/65",
                        ].join(" ")}
                      >
                        {s.label}
                      </div>
                      {subtitle && (
                        <div className="text-[10px] text-purple-200/75 font-medium">
                          {subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_18px_rgba(168,85,247,0.75)]"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

