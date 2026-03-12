import Stripe from "stripe";

export type StripeSummary = {
  accountId?: string;
  businessName?: string | null;
  country?: string | null;
  defaultCurrency?: string | null;
  available: Array<{ amount: number; currency: string }>;
  pending: Array<{ amount: number; currency: string }>;
  categories: Array<{ category: string; amount: number; currency: string }>;
  firstEarnedAt?: string;
  lastEarnedAt?: string;
};

function getStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });
}

export async function fetchStripeSummary(secretKey: string): Promise<StripeSummary> {
  const stripe = getStripeClient(secretKey);

  const [account, balance, txs] = await Promise.all([
    stripe.accounts.retrieve(),
    stripe.balance.retrieve(),
    stripe.balanceTransactions.list({ limit: 50 }),
  ]);

  const currency =
    (account.default_currency ?? balance.available?.[0]?.currency ?? "usd").toLowerCase();

  const categoriesMap = new Map<string, number>();
  let minCreated: number | null = null;
  let maxCreated: number | null = null;

  for (const t of txs.data) {
    const cat = (t.reporting_category ?? t.type ?? "other").toString();
    const prev = categoriesMap.get(cat) ?? 0;
    categoriesMap.set(cat, prev + (t.net ?? t.amount));

    if (typeof t.created === "number") {
      minCreated = minCreated === null ? t.created : Math.min(minCreated, t.created);
      maxCreated = maxCreated === null ? t.created : Math.max(maxCreated, t.created);
    }
  }

  const categories = Array.from(categoriesMap.entries())
    .map(([category, amount]) => ({ category, amount, currency }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  return {
    accountId: account.id,
    businessName: account.business_profile?.name ?? null,
    country: account.country ?? null,
    defaultCurrency: account.default_currency ?? null,
    available: balance.available.map((b) => ({ amount: b.amount, currency: b.currency })),
    pending: balance.pending.map((b) => ({ amount: b.amount, currency: b.currency })),
    categories,
    firstEarnedAt: minCreated ? new Date(minCreated * 1000).toISOString() : undefined,
    lastEarnedAt: maxCreated ? new Date(maxCreated * 1000).toISOString() : undefined,
  };
}

export function formatMoneyMinor(amountMinor: number, currency: string) {
  // Stripe amounts are in the smallest currency unit
  const major = amountMinor / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(major);
}

