"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OnboardingLayout from "./OnboardingLayout";
import StepGoal from "./StepGoal";
import StepMotivation from "./StepMotivation";
import StepBMI from "./StepBMI";
import StepAccount from "./StepAccount";
import StepTextAlerts from "./StepTextAlerts";
import StepPlanSelection from "./StepPlanSelection";
import StepMedication from "./StepMedication";
import StepCheckout from "./StepCheckout";
import { useAuth } from "@/lib/AuthContext";
import AppIcon from "@/components/ui/AppIcon";

const TOTAL_STEPS = 8;

const fadeVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function OnboardingFlow() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    goal: "",
    motivation: "",
    feet: "",
    inches: "",
    weight: "",
    email: "",
    password: "",
    textAlerts: null,
    plan: "",
    medication: "",
    paymentComplete: false,
  });

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));
  const getNextStep = (s) => {
    let nextStep = s + 1;
    if (isAuthenticated && nextStep === 4) nextStep = 5;
    return Math.min(nextStep, TOTAL_STEPS);
  };
  const getPreviousStep = (s) => {
    let previousStep = s - 1;
    if (isAuthenticated && previousStep === 4) previousStep = 3;
    return Math.max(previousStep, 1);
  };
  const next = (patch) => {
    if (patch) update(patch);
    setStep((s) => getNextStep(s));
  };
  const back = () => setStep((s) => getPreviousStep(s));

  const handleAccountCreated = () => {
    update({ accountCreated: true });
    setStep(5);
  };

  const handleComplete = (patch) => {
    if (patch) update(patch);
    setStep(TOTAL_STEPS + 1);
  };

  useEffect(() => {
    if (isAuthenticated && step === 4) {
      setStep(5);
    }
  }, [isAuthenticated, step]);

  const totalVisibleSteps = isAuthenticated ? TOTAL_STEPS - 1 : TOTAL_STEPS;
  const displayStep =
    isAuthenticated && step > 4 ? step - 1 : Math.min(step, totalVisibleSteps);

  // Success screen
  if (step > TOTAL_STEPS) {
    return (
      <OnboardingLayout step={totalVisibleSteps} totalSteps={totalVisibleSteps}>
        <div className="text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full hs-gradient mx-auto flex items-center justify-center">
            <AppIcon name="check_circle" className="text-white text-4xl" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-[#1c1a24]">
            You&apos;re all set!
          </h1>
          <p className="text-[#484555] font-body text-lg max-w-md mx-auto">
            Your account has been created and your order is confirmed. Our
            medical team will review your information and follow up shortly.
          </p>
          <a
            href="/"
            className="inline-block hs-gradient-btn px-8 py-3 rounded-xl text-sm font-semibold"
          >
            Go to Homepage
          </a>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      step={displayStep}
      totalSteps={totalVisibleSteps}
      onBack={step > 1 ? back : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <StepGoal
              value={data.goal}
              onChange={(v) => update({ goal: v })}
              onNext={() => next()}
            />
          )}
          {step === 2 && (
            <StepMotivation
              value={data.motivation}
              onChange={(v) => update({ motivation: v })}
              onNext={() => next()}
            />
          )}
          {step === 3 && (
            <StepBMI
              feet={data.feet}
              inches={data.inches}
              weight={data.weight}
              onChange={update}
              onNext={() => next()}
            />
          )}
          {step === 4 && (
            <StepAccount
              email={data.email}
              password={data.password}
              onChange={update}
              onSubmit={handleAccountCreated}
            />
          )}
          {step === 5 && <StepTextAlerts onNext={next} onBack={back} />}
          {step === 6 && <StepPlanSelection onNext={next} />}
          {step === 7 && <StepMedication onNext={next} />}
          {step === 8 && <StepCheckout data={data} onNext={handleComplete} />}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
}
