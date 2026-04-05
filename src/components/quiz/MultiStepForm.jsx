"use client";

import React, { useMemo, useState } from "react";

export default function MultiStepForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState({
    goal: "",
    motivation: "",
    feet: "",
    inches: "",
    weight: "",
    email: "",
    password: "",
  });

  const steps = useMemo(
    () => [
      { key: "goal", title: "Weight Goal" },
      { key: "motivation", title: "Motivation" },
      { key: "bmi", title: "BMI" },
      { key: "account", title: "Create Account" },
    ],
    [],
  );

  const update = (patch) => setValues((s) => ({ ...s, ...patch }));

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const computeBMI = () => {
    const ft = Number(values.feet) || 0;
    const inch = Number(values.inches) || 0;
    const w = Number(values.weight) || 0;
    const heightInMeters = (ft * 12 + inch) * 0.0254;
    if (!heightInMeters || !w) return null;
    const kg = w * 0.45359237;
    return (kg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    // Replace with real submit logic
    // For now just log and show a simple success state
    console.log("Form submitted", values);
    setStepIndex(steps.length);
  };

  if (stepIndex >= steps.length) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">
          Thanks — we received your answers
        </h2>
        <p className="text-muted mb-6">
          Our team will review your intake and follow up by email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold">{steps[stepIndex].title}</h1>
          <div className="text-sm text-slate-500">
            Step {stepIndex + 1} of {steps.length}
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
            style={{
              width: `${Math.round(((stepIndex + 1) / steps.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {stepIndex === 0 && (
          <div className="space-y-4">
            <p className="text-slate-600">What is your weight loss goal?</p>
            {[
              "Lose 1-20 lbs for good",
              "Lose 21-50 lbs for good",
              "Lose over 50 lbs for good",
              "Maintain my weight and get fit",
            ].map((opt) => (
              <label
                key={opt}
                className="flex items-center p-4 rounded-xl border hover:border-indigo-400"
                htmlFor={opt}
              >
                <input
                  id={opt}
                  name="goal"
                  type="radio"
                  checked={values.goal === opt}
                  onChange={() => update({ goal: opt })}
                  className="mr-3"
                />
                <span className="font-medium">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {stepIndex === 1 && (
          <div className="space-y-4">
            <p className="text-slate-600">
              What are you hoping to improve by losing weight?
            </p>
            {[
              "My physical health",
              "My appearance",
              "My mental health",
              "All of the above",
            ].map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => update({ motivation: opt })}
                className={`w-full text-left p-4 rounded-xl border ${values.motivation === opt ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <p className="text-slate-600">
              Enter your height and weight to estimate BMI.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Feet</label>
                <input
                  value={values.feet}
                  onChange={(e) => update({ feet: e.target.value })}
                  type="number"
                  className="w-full rounded-xl p-3 border"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Inches</label>
                <input
                  value={values.inches}
                  onChange={(e) => update({ inches: e.target.value })}
                  type="number"
                  className="w-full rounded-xl p-3 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Weight (lbs)</label>
              <input
                value={values.weight}
                onChange={(e) => update({ weight: e.target.value })}
                type="number"
                className="w-full rounded-xl p-3 border"
              />
            </div>
            <div className="pt-2">
              <span className="text-sm text-slate-600">Estimated BMI: </span>
              <span className="font-semibold">{computeBMI() ?? "—"}</span>
            </div>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="space-y-4">
            <p className="text-slate-600">
              Create an account to save your intake.
            </p>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                value={values.email}
                onChange={(e) => update({ email: e.target.value })}
                type="email"
                className="w-full rounded-xl p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                value={values.password}
                onChange={(e) => update({ password: e.target.value })}
                type="password"
                className="w-full rounded-xl p-3 border"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="px-4 py-2 rounded-lg border"
          >
            Back
          </button>
          {stepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
