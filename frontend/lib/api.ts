// ABOUTME: Typed fetch client for the mini-issue-tracker backend API.
// ABOUTME: All requests include the Clerk JWT as Authorization Bearer token.

import { Issue, IssueCreate, IssueUpdate, Label, LabelCreate } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Issues

export function listIssues(
  token: string,
  params: { status?: string; priority?: string; label_id?: string } = {}
): Promise<Issue[]> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) as Record<string, string>
  ).toString();
  return request<Issue[]>(`/api/v1/issues${query ? `?${query}` : ""}`, token);
}

export function getIssue(token: string, id: string): Promise<Issue> {
  return request<Issue>(`/api/v1/issues/${id}`, token);
}

export function createIssue(token: string, data: IssueCreate): Promise<Issue> {
  return request<Issue>("/api/v1/issues", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateIssue(token: string, id: string, data: IssueUpdate): Promise<Issue> {
  return request<Issue>(`/api/v1/issues/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteIssue(token: string, id: string): Promise<void> {
  return request<void>(`/api/v1/issues/${id}`, token, { method: "DELETE" });
}

// Labels

export function listLabels(token: string): Promise<Label[]> {
  return request<Label[]>("/api/v1/labels", token);
}

export function createLabel(token: string, data: LabelCreate): Promise<Label> {
  return request<Label>("/api/v1/labels", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteLabel(token: string, id: string): Promise<void> {
  return request<void>(`/api/v1/labels/${id}`, token, { method: "DELETE" });
}
