// ABOUTME: Issue creation page with a form for title, description, status, priority, and labels.
// ABOUTME: Requires authentication.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import IssueForm from "@/components/IssueForm";

export default async function NewIssuePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">New Issue</h1>
      <IssueForm />
    </div>
  );
}
