// ABOUTME: Issue detail page showing current values and an inline edit form.
// ABOUTME: Requires authentication.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import IssueDetail from "@/components/IssueDetail";

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  return <IssueDetail id={id} />;
}
