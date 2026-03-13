import { redirect } from "next/navigation";
import { getUserFromRequestSession } from "@/lib/auth";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  return (
    <DashboardClientWrapper user={{ 
        username: user.username, 
        email: user.email 
    }}>
      {children}
    </DashboardClientWrapper>
  );
}

