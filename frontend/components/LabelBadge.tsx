// ABOUTME: Displays a label as a colored badge using the label's hex color.
// ABOUTME: Used in IssueCard and IssueDetail.

"use client";

import { Label } from "@/lib/types";

export default function LabelBadge({ label }: { label: Label }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: label.color }}
    >
      {label.name}
    </span>
  );
}
