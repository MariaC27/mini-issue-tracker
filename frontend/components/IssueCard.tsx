// ABOUTME: Compact card for a single issue in the list view.
// ABOUTME: Shows title, priority, labels, and an inline status selector.

"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { updateIssue } from "@/lib/api";
import { Issue, IssueStatus } from "@/lib/types";
import LabelBadge from "./LabelBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-700",
};

export default function IssueCard({
  issue,
  onUpdate,
}: {
  issue: Issue;
  onUpdate: () => void;
}) {
  const { getToken } = useAuth();

  async function handleStatusChange(newStatus: IssueStatus) {
    const token = await getToken();
    if (!token) return;
    await updateIssue(token, issue.id, { status: newStatus });
    onUpdate();
  }

  return (
    <div className="border rounded-lg px-4 py-3 flex items-start justify-between gap-3 hover:bg-muted/50 transition-colors">
      <Link href={`/issues/${issue.id}`} className="flex-1 min-w-0">
        <p className="font-medium truncate">{issue.title}</p>
        {issue.description && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{issue.description}</p>
        )}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.labels.map((l) => (
              <LabelBadge key={l.id} label={l} />
            ))}
          </div>
        )}
      </Link>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[issue.priority]}`}>
          {issue.priority}
        </span>
        <Select value={issue.status} onValueChange={(v) => handleStatusChange(v as IssueStatus)}>
          <SelectTrigger className="h-7 text-xs w-32 px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
