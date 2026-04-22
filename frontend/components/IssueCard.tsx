// ABOUTME: Compact card for a single issue in the list view.
// ABOUTME: Shows title, status, priority, and labels with a link to the detail page.

"use client";

import Link from "next/link";
import { Issue } from "@/lib/types";
import LabelBadge from "./LabelBadge";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-600",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-700",
};

export default function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.id}`} className="block hover:bg-muted/50 transition-colors">
      <div className="border rounded-lg px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
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
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[issue.priority]}`}>
            {issue.priority}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[issue.status]}`}>
            {issue.status.replace("_", " ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
