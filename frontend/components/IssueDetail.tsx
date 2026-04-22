// ABOUTME: Issue detail view with inline editing for all fields.
// ABOUTME: Handles update and delete operations for a single issue.

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { deleteIssue, getIssue, listLabels, updateIssue } from "@/lib/api";
import { Issue, IssuePriority, IssueStatus, Label } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LabelBadge from "./LabelBadge";

export default function IssueDetail({ id }: { id: string }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [allLabels, setAllLabels] = useState<Label[]>([]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("open");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      const [issueData, labelsData] = await Promise.all([
        getIssue(token, id),
        listLabels(token),
      ]);
      setIssue(issueData);
      setAllLabels(labelsData);
    }
    load();
  }, [id, getToken]);

  function startEditing() {
    if (!issue) return;
    setTitle(issue.title);
    setDescription(issue.description ?? "");
    setStatus(issue.status);
    setPriority(issue.priority);
    setSelectedLabelIds(issue.labels.map((l) => l.id));
    setEditing(true);
  }

  function toggleLabel(labelId: string) {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((x) => x !== labelId) : [...prev, labelId]
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const updated = await updateIssue(token, id, {
        title,
        description: description || undefined,
        status,
        priority,
        label_ids: selectedLabelIds,
      });
      setIssue(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this issue?")) return;
    const token = await getToken();
    if (!token) return;
    await deleteIssue(token, id);
    router.push("/");
  }

  if (!issue) return <p className="text-muted-foreground text-sm">Loading...</p>;

  if (!editing) {
    return (
      <div className="max-w-xl">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
          ← All Issues
        </Link>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold">{issue.title}</h1>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={startEditing}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <span className="text-sm text-muted-foreground">
            Status: <strong>{issue.status.replace("_", " ")}</strong>
          </span>
          <span className="text-sm text-muted-foreground">
            Priority: <strong>{issue.priority}</strong>
          </span>
        </div>

        {issue.description && (
          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
            {issue.description}
          </p>
        )}

        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.labels.map((l) => (
              <LabelBadge key={l.id} label={l} />
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Created {new Date(issue.created_at).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        ← All Issues
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Edit Issue</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as IssueStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <Select value={priority} onValueChange={(v) => setPriority(v as IssuePriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {allLabels.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Labels</label>
            <div className="flex flex-wrap gap-2">
              {allLabels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`rounded-full px-1 py-0.5 border-2 transition-all ${
                    selectedLabelIds.includes(label.id)
                      ? "border-foreground"
                      : "border-transparent"
                  }`}
                >
                  <LabelBadge label={label} />
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
