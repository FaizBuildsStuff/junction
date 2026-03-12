export type MockCostSummary = {
  serviceId: string;
  currentSpend: number;
  monthlyLimit: number | null;
  renewalDate: string; // ISO string
  currency: string;
  status: "active" | "warning" | "exceeded";
  details?: { label: string; value: string | number }[];
};

// Deterministic seed based on string
const hashStr = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export function getMockCostsForService(serviceId: string): MockCostSummary {
  const hash = hashStr(serviceId);

  // Deterministic values based on serviceId hash
  const now = new Date();

  // Set renewal date somewhere between 1 and 30 days from now
  const daysUntilRenewal = (hash % 30) + 1;
  const renewalDate = new Date();
  renewalDate.setDate(now.getDate() + daysUntilRenewal);

  // Determine a realistic monthly limit
  const baseLimits = [20, 50, 100, 250, 500, 1000, 2500];
  const monthlyLimit = baseLimits[hash % baseLimits.length];

  // Determine current spend as a percentage of the limit
  const percentSpentDecimals = [0.1, 0.45, 0.75, 0.92, 0.98, 1.05];
  const factor = percentSpentDecimals[(hash * 7) % percentSpentDecimals.length];

  let currentSpend = +(monthlyLimit * factor).toFixed(2);

  // Specific overrides for realism based on service names
  if (serviceId === "openai") {
    currentSpend = hash % 2 === 0 ? 142.5 : 842.1;
  }

  let status: "active" | "warning" | "exceeded" = "active";
  if (currentSpend > monthlyLimit) status = "exceeded";
  else if (currentSpend > monthlyLimit * 0.85) status = "warning";

  return {
    serviceId,
    currentSpend,
    monthlyLimit,
    renewalDate: renewalDate.toISOString(),
    currency: "USD",
    status,
  };
}
