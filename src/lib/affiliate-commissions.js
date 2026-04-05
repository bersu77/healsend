// Affiliate commission structure for HealSend
// These are the flat commissions paid per new subscription order.

export const AFFILIATE_COMMISSIONS = {
  tirzepatide: {
    monthly: 50,
    threeMonth: 100,
    twelveMonth: 260,
  },
  semaglutide: {
    monthly: 35,
    threeMonth: 70,
    twelveMonth: 200,
  },
};

// Human-readable labels for plan intervals
export const PLAN_INTERVAL_LABELS = {
  monthly: "Monthly",
  threeMonth: "3-Month",
  twelveMonth: "12-Month",
};
