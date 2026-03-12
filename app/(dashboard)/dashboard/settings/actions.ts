"use server";

import { revalidatePath } from "next/cache";
import { getUserFromRequestSession } from "@/lib/auth";
import { dbQuery } from "@/lib/db";

export async function updateProfile(data: { username: string; email: string }) {
  const user = await getUserFromRequestSession();
  if (!user) throw new Error("Unauthorized");

  const { username, email } = data;
  if (!username.trim() || !email.trim()) {
    throw new Error("Username and email cannot be empty");
  }

  const emailCheck = await dbQuery(
    `SELECT id FROM users WHERE email = $1 AND id != $2`,
    [email, user.id],
  );

  if (emailCheck.rowCount && emailCheck.rowCount > 0) {
    throw new Error("Email is already in use by another account.");
  }

  await dbQuery(`UPDATE users SET username = $1, email = $2 WHERE id = $3`, [
    username,
    email,
    user.id,
  ]);

  revalidatePath("/dashboard/settings");
}
