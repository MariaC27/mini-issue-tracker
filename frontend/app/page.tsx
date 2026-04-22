// ABOUTME: Issue list page with status/priority filter controls.
// ABOUTME: Requires sign-in; redirects unauthenticated users to sign-in.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import IssueList from "@/components/IssueList";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Issues</h1>
        <Link href="/issues/new">
          <Button>New Issue</Button>
        </Link>
      </div>
      <IssueList />
    </div>
  );
}
