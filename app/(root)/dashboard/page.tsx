import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromRequestSession } from "@/lib/auth";
import SignOutButton from "@/app/(root)/dashboard/SignOutButton";

export default async function DashboardPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  return (
    <main className="min-h-screen pt-32 px-4 md:px-10 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-white rounded-3xl border border-black/5 shadow-[0_20px_60px_rgba(22,44,37,0.08)] p-8 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40">
                Dashboard
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-[#162C25]">
                Welcome, {user.username}.
              </h1>
              <p className="mt-4 text-[#162C25]/60 font-medium">
                You’re authenticated via Neon Postgres session cookies.
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-[#F2F9F1] px-5 py-3 text-[12px] font-black uppercase tracking-widest text-[#162C25] hover:opacity-70 transition-opacity"
            >
              Back home
            </Link>
          </div>

          <div className="mt-6">
            <SignOutButton />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { k: "User ID", v: user.id },
              { k: "Email", v: user.email },
              { k: "Session", v: "Active" },
            ].map((card) => (
              <div
                key={card.k}
                className="rounded-2xl bg-[#F2F9F1] border border-black/5 p-5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40">
                  {card.k}
                </p>
                <p className="mt-2 font-bold text-sm text-[#162C25] break-all">
                  {card.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

