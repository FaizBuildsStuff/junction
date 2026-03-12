"use server";

import { revalidatePath } from "next/cache";
import { getUserFromRequestSession } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

export async function upsertServiceKey(serviceId: string, valueText: string) {
  const user = await getUserFromRequestSession();
  if (!user) throw new Error("Unauthorized");

  if (!valueText.trim()) {
    throw new Error("Key value cannot be empty");
  }

  await dbQuery(
    `
    INSERT INTO user_service_keys (user_id, service_id, value_text)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, service_id)
    DO UPDATE SET value_text = EXCLUDED.value_text, created_at = now()
    `,
    [user.id, serviceId, valueText],
  );

  revalidatePath("/dashboard/infrastructure");
}

export async function deleteServiceKey(serviceId: string) {
  const user = await getUserFromRequestSession();
  if (!user) throw new Error("Unauthorized");

  await dbQuery(
    `DELETE FROM user_service_keys WHERE user_id = $1 AND service_id = $2`,
    [user.id, serviceId],
  );

  revalidatePath("/dashboard/infrastructure");
}
