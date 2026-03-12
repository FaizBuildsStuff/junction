import { dbQuery, ensureAuthSchema } from "@/lib/db";

export type ServiceKeyRow = {
  service_id: string;
  value_text: string;
  created_at: Date;
};

export async function getUserServiceKeys(userId: string) {
  await ensureAuthSchema();
  const result = await dbQuery<ServiceKeyRow>(
    `
    select service_id, value_text, created_at
    from user_service_keys
    where user_id = $1
    order by created_at desc
  `,
    [userId]
  );
  return result.rows;
}

export function maskSecret(value: string) {
  const v = value.trim();
  if (v.length <= 8) return "••••••••";
  return `${v.slice(0, 4)}••••••••${v.slice(-4)}`;
}

