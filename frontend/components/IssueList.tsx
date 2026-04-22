// ABOUTME: Issue list with status and priority filter controls.
// ABOUTME: Fetches issues from the API using the Clerk token.

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { listIssues } from "@/lib/api";
import { Issue, IssueStatus, IssuePriority } from "@/lib/types";
import IssueCard from "./IssueCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IssueList() {
  const { getToken } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<IssueStatus | "">("");
  const [priority, setPriority] = useState<IssuePriority | "">("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      try {
        const data = await listIssues(token, {
          status: status || undefined,
          priority: priority || undefined,
        });
        if (!cancelled) setIssues(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [status, priority, getToken]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <Select value={status} onValueChange={(v) => setStatus(v as IssueStatus | "")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as IssuePriority | "")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : issues.length === 0 ? (
        <p className="text-muted-foreground text-sm">No issues found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
